import React, { useState, useEffect, useRef } from 'react';
import {Helmet} from "react-helmet";
import { Toast } from 'primereact/toast';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Chip } from 'primereact/chip';
import { Avatar } from 'primereact/avatar';
import { AvatarGroup } from 'primereact/avatargroup';
import { Dialog } from 'primereact/dialog';
import './App.css';
import {LocalDate} from "local-date";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Calendar } from 'primereact/calendar';
import { Tag } from 'primereact/tag';
import { Card } from 'primereact/card';
import { faCircle } from '@fortawesome/fontawesome-free-solid';

import { MapContainer } from 'react-leaflet/MapContainer'
import { TileLayer } from 'react-leaflet/TileLayer'
import { Marker } from 'react-leaflet/Marker'
import { Popup } from 'react-leaflet/Popup'
import { useMap } from 'react-leaflet/hooks'
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

import { AccessAlarm, MenuBookRounded, BadgeRounded, DesktopWindowsRounded,
    StyleRounded, LocationOnRounded, CalendarMonthRounded} from '@mui/icons-material';

import 'primereact/resources/themes/fluent-light/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';

function App() {
    const toast = useRef(null);
    const [danceEvents, setDanceEvents] = useState(null);
    const [danceEvent, setDanceEvent] = useState({
        title: "",
        description: "",
        website: "",
        startFrom: "2023-01-01",
        finishTo: "2023-01-01",
        genres: [],
        teachers: [],
        locationCountryName: "",
        locationCountry: "",
        locationCity: "",
        locationLat: "",
        locationLong: "",
        duration: {
            durationStr: "",
            durationCountStr: ""
        }
    });
    const [displayDialog, setDisplayDialog] = useState(false);

    let DefaultIcon = L.icon({
        iconUrl: icon,
        shadowUrl: iconShadow
    });

    L.Marker.prototype.options.icon = DefaultIcon;

    /*https://swingwithme-7sudn4wnvq-ew.a.run.app */

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
            ).then(data => {
                toast.current.show({ severity: 'info', summary: 'Data loaded', detail: 'loaded', life: 3000 });
            })
    }, []);

    const onClick = (data) => {
        setDanceEvent(data);
        setDisplayDialog(true);
    }

    const onHide = () => {
        setDisplayDialog(false);
    }

    const headerTemplate = (data) => {
        return (
            <React.Fragment>
                <span className="year">{data.eventListGropingYear}</span>
                <span className="month">{data.eventListGropingMonth}</span>
                <span className="month-counter">/ {calculateEventTotal(data.eventListGroping)}</span>
            </React.Fragment>
        );
    }

    const rowClass = (data) => {
        return {
            'past-event': data.pastEvent == true
        }
    }

    const eventTitleTemplate = (data) => {
        var newLable = "";
        if (data.newEvent) {
            newLable = (<Tag className="mr-2" severity="success" value="new"></Tag>);
        }

        var teachers = "";
        if (data.exchange) {
            teachers = (<Chip label="Exchange" />)
        } else {
            teachers = (
                <AvatarGroup>
                    {data.teachers.map(d => (<Avatar image={d.profilePictureSrc}
                                                     title={d.displayName}
                                                     imageAlt={d.displayName}
                                                     label={d.displayName.match(/\b(\w)/g).join('')}
                                                     shape="circle"/>))}
                </AvatarGroup>
            )
        }

        return (
            <React.Fragment>
                <div className="flex justify-content-between flex-wrap title-container">
                    <div>
                        <span className="event-title" onClick={event => onClick(data)}>{data.title}</span>
                        {newLable}
                    </div>
                    {teachers}
                </div>
            </React.Fragment>
        );
    }

    const eventLocationTemplate = (data) => {
        return (
            <React.Fragment>
                <span><img alt={data.locationCountryName} src={`icons/flags/${data.locationCountry}.svg`} height={"16px"} className="flag-icon" /></span>
                <span>{data.locationCountryName}, </span>
                <span>{data.locationCity}</span>
            </React.Fragment>
        );
    }

    const eventGenresTemplate = (data) => {
        return (
            <React.Fragment>
                <div className="flex align-items-center flex-wrap">
                    {data.genres.map(d => (<Chip label={d.code} className={`mr-2 mb-2 ${d.code}`} title={d.title} key={d.code} />))}
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

    const renderHeader = () => {
        return (
            <span>{danceEvent.title}</span>
        );
    }

    const renderCalendar = () => {

        const startFrom = new LocalDate(danceEvent.startFrom);
        const finishTo = new LocalDate(danceEvent.finishTo);

        return (
            <Calendar value={[new Date(startFrom.getFullYear(), startFrom.getMonth(), startFrom.getDate()),
                              new Date(finishTo.getFullYear(), finishTo.getMonth(), finishTo.getDate())]}
                      inline disabled={true} selectionMode="range" />
        );
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
            <Dialog header={renderHeader()} visible={displayDialog} style={{ width: '1000px' }} onHide={() => onHide()}>
                <div className="card-container blue-container flex align-items-start justify-content-start details-dialog">
                    <div className="flex flex-column">
                        <div className="grid">
                            <div className="col-fixed" style={{width: '40px'}}>
                                <CalendarMonthRounded />
                            </div>
                            <div className="col">
                                <span className="duration-str">{danceEvent.duration.durationStr}</span>
                                <span>{danceEvent.duration.durationCountStr}</span>
                            </div>
                        </div>
                        <div className="grid">
                            <div className="col-fixed" style={{width: '40px'}}>
                                <StyleRounded />
                            </div>
                            <div className="col">
                                <div className="flex align-items-center flex-wrap">
                                    {danceEvent.genres.map(d => (<Chip label={d.title} className={`mr-2 mb-2 ${d.code}`} title={d.title} key={d.code} />))}
                                </div>
                            </div>
                        </div>
                        <div className="grid">
                            <div className="col-fixed" style={{width: '40px'}}>
                                <LocationOnRounded />
                            </div>
                            <div className="col">
                                <div className="flex align-items-center flex-wrap">
                                    <span><img alt={danceEvent.locationCountryName} src={`icons/flags/${danceEvent.locationCountry}.svg`} height={"16px"} className="flag-icon"/></span>
                                    <span>{danceEvent.locationCountryName}, </span>
                                    <span>{danceEvent.locationCity}</span>
                                </div>
                            </div>
                        </div>
                        <div className="grid">
                            <div className="col-fixed" style={{width: '40px'}}>
                                <DesktopWindowsRounded />
                            </div>
                            <div className="col"><a target="_blank" href={danceEvent.website} rel="noopener">{danceEvent.website}</a></div>
                        </div>
                        <div className="grid">
                            <div className="col-fixed" style={{width: '40px'}}>
                                <BadgeRounded />
                            </div>
                            <div className="col">
                                <div className="flex flex-row flex-wrap card-container">
                                    {danceEvent.teachers.map(d => (
                                        <div className="flex flex-column align-items-center justify-content-center profile-card" key={d.displayName}>
                                            <div className="flex">
                                                <Avatar image={d.profilePictureSrc} style={{width: '60px', height: '60px'}}
                                                                             title={d.displayName}
                                                                             imageAlt={d.displayName}
                                                                             label={d.displayName.match(/\b(\w)/g).join('')}
                                                                             shape="circle"/>
                                            </div>
                                            <div className="flex profile-name">
                                                <span>{d.displayName}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="grid">
                            <div className="col-fixed" style={{width: '40px'}}>
                                <MenuBookRounded />
                            </div>
                            <div className="col">{danceEvent.description}</div>
                        </div>
                    </div>
                    <div className="flex flex-column" style={{width: '300px'}}>
                        {renderCalendar()}
                        <div className="map" style={{width: '300px', height: '300px'}}>
                            <MapContainer center={[danceEvent.locationLat, danceEvent.locationLong]} zoom={10}
                                          scrollWheelZoom={false} style={{width: '300px', height: '300px'}}>
                                <TileLayer
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                />
                                <Marker position={[danceEvent.locationLat, danceEvent.locationLong]}>
                                    <Popup>
                                    </Popup>
                                </Marker>
                            </MapContainer>
                        </div>
                    </div>
                </div>
            </Dialog>

            <content>
                <div id="content-holder">
                    <DataTable value={danceEvents}
                               className="event-table-list"
                               sortMode="single" sortField="startFrom" sortOrder={1}
                               rowGroupMode="subheader" groupRowsBy="eventListGroping"
                               rowGroupHeaderTemplate={headerTemplate}
                               scrollable
                               responsiveLayout="scroll"
                               rowClassName={rowClass}>

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
