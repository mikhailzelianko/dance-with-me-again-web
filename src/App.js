import React, { useState, useEffect, useRef } from 'react';
import {Helmet} from "react-helmet";
import { Toast } from 'primereact/toast';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Chip } from 'primereact/chip';
import { Avatar } from 'primereact/avatar';
import { AvatarGroup } from 'primereact/avatargroup';
import './App.css';
import {LocalDate} from "local-date";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircle } from '@fortawesome/fontawesome-free-solid';

import 'primereact/resources/themes/fluent-light/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';

function App() {
    const toast = useRef(null);
    const [danceEvents, setDanceEvents] = useState(null);

    useEffect(() => {
        fetch("http://localhost:8080/api/danceEvents/all")
            .then(res => res.json())
            .then(data => setDanceEvents(data),
                // Note: it's important to handle errors here
                // instead of a catch() block so that we don't swallow
                // exceptions from actual bugs in components.
                (error) => {
                    toast.current.show({ severity: 'error', summary: 'Error', detail: error, life: 3000 });
                }
            )
    }, []);

    const headerTemplate = (data) => {
        return (
            <React.Fragment>
                <span className="year">{data.eventListGropingYear}</span>
                <span className="month">{data.eventListGropingMonth}</span>
                <span className="month-counter">/ {calculateEventTotal(data.eventListGroping)}</span>
            </React.Fragment>
        );
    }

    const eventTitleTemplate = (data) => {
        return (
            <React.Fragment>
                <div className="flex justify-content-between flex-wrap title-container">
                    <div>
                        <span className="event-title">{data.title}</span>
                    </div>
                    <AvatarGroup>
                        {data.teachers.map(d => (<Avatar image={d.profilePictureSrc}
                                                         title={d.displayName}
                                                         imageAlt={d.displayName}
                                                         label={d.displayName.match(/\b(\w)/g).join('')}
                                                         shape="circle"/>))}
                    </AvatarGroup>
                </div>
            </React.Fragment>
        );
    }

    const eventLocationTemplate = (data) => {
        return (
            <React.Fragment>
                <span><img alt={data.locationCountryName} src={`icons/flags/${data.locationCountry}.svg`} height={"16px"} /></span>
                <span>{data.locationCountryName}, </span>
                <span>{data.locationCity}</span>
            </React.Fragment>
        );
    }

    const eventGenresTemplate = (data) => {
        return (
            <React.Fragment>
                <div className="flex align-items-center flex-wrap">
                    {data.genres.map(d => (<Chip label={d.code} className={`mr-2 mb-2 ${d.code}`} title={d.title} />))}
                </div>
            </React.Fragment>
        );
    }

    const eventDurationTemplate = (data) => {
        const startFrom = new LocalDate(data.startFrom);
        var finishTo = new LocalDate(data.finishTo);

        return (
            <React.Fragment>
                <div className="duration">
                    <span className="duration-from">{startFrom.getDate()}</span>
                    <span> - </span>
                    <span className="duration-to">{finishTo.getDate()}</span>
                </div>
            </React.Fragment>
        );
    }

    const eventDurationWeekTemplate = (data) => {

       var weeks = data.duration.weeks;
       var daysBetween = data.duration.durationCount;
       var daysBetweenStr = daysBetween + " " + (daysBetween > 1 ? "days" : "day");

       var durationWeeks = weeks.map((week) =>
            <div className="week">
                {week.map((day) => {
                        let icon;
                        if (day) {
                            icon = <FontAwesomeIcon icon="fa-circle" className="duration-icon festival-day" />
                        } else {
                            icon = <FontAwesomeIcon icon="fa-circle" className="duration-icon" />
                        }
                        return icon;
                    }
                )}
            </div>
        );

        /*var weekContainer = week.map((day) => {
                let dd;
                if (day) {
                    dd = <span>1</span>
                } else {
                    dd = <span>2</span>
                }
                return dd;
            }
        );*/


        return (
            <React.Fragment>
                <div className="duration">
                    {durationWeeks}
                </div>
                <div className="duration-count">
                    <span>| {daysBetweenStr}</span>
                </div>
            </React.Fragment>
        );
    }

    const calculateEventTotal = (eventListGroping) => {
        let total = 0;

        if (danceEvents) {
            for (let danceEvent of danceEvents) {
                if (danceEvent.eventListGroping === eventListGroping) {
                    total++;
                }
            }
        }

        return total;
    }



    return (
        <div className="App">
            <Helmet>
                { /* Standard metadata tags */ }
                <title>Swing with me</title>
                <meta name='description' content='Swing with me - calendar for Lindy hop, Balboa, Blues, Shag, Charlston festivals' />
                { /* End standard metadata tags */ }
                { /* Facebook tags
                <meta property="og:type" content={type} />*/ }
                <meta property="og:title" content='Swing with me' />
                <meta property="og:description" content='Swing with me - calendar for Lindy hop, Balboa, Blues, Shag, Charlston festivals' />
                { /* End Facebook tags */ }
                { /* Twitter tags }
                <meta name="twitter:creator" content={name} />}
                <meta name="twitter:card" content={type} />
                <meta name="twitter:title" content='Swing with me' /> */ }
                <meta name="twitter:description" content='Swing with me - calendar for Lindy hop, Balboa, Blues, Shag, Charlston festivals' />
                { /* End Twitter tags */ }
            </Helmet>
            <Toast ref={toast} />
            <header>
                <nav>
                  <img src="images/swm.png" className="logo" alt="Swing with me" height="44"/>
                </nav>
            </header>

            <content>
                <div id="content-holder">
                    <DataTable value={danceEvents}
                               className="event-table-list"
                               sortMode="single" sortField="startFrom" sortOrder={1}
                               rowGroupMode="subheader" groupRowsBy="eventListGroping"
                               rowGroupHeaderTemplate={headerTemplate}
                               scrollable
                               responsiveLayout="scroll">

                        <Column body={eventDurationTemplate} style={{ maxWidth: '60px' }}></Column>
                        <Column body={eventDurationWeekTemplate} style={{ maxWidth: '130px' }}></Column>
                        <Column body={eventTitleTemplate}></Column>
                        <Column body={eventGenresTemplate} style={{ maxWidth: '200px' }}></Column>
                        <Column body={eventLocationTemplate} style={{ maxWidth: '280px' }}></Column>
                    </DataTable>
                </div>
            </content>

        </div>
    );
}

export default App;
