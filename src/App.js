import React, { useState, useEffect, useRef } from 'react';
import {Helmet} from "react-helmet";
import ReactGA from "react-ga4";
import CookieConsent from "react-cookie-consent";

import { Toast } from 'primereact/toast';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Chip } from 'primereact/chip';
import { Avatar } from 'primereact/avatar';
import { AvatarGroup } from 'primereact/avatargroup';
import { Dialog } from 'primereact/dialog';
import {LocalDate} from "local-date";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Calendar } from 'primereact/calendar';
import { Tag } from 'primereact/tag';
import { InputText } from 'primereact/inputtext';
import { faCircle } from '@fortawesome/fontawesome-free-solid';
import { MultiSelect } from 'primereact/multiselect';
import { Button } from 'primereact/button';
import { Tooltip } from 'primereact/tooltip';
import { locale, addLocale, updateLocaleOption, updateLocaleOptions, localeOption, localeOptions } from 'primereact/api';

import MarkerClusterGroup from 'react-leaflet-cluster'
import { MapContainer, Marker, Popup, TileLayer, Tooltip as LeafletTooltip} from 'react-leaflet'
import { useMap } from 'react-leaflet/hooks'
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
//import icon from 'leaflet/dist/images/marker-icon.png';
import icon from './image/map/marker-icon-clear.png';
import iconCamp from './image/map/marker-icon-camp.png';
import iconCruise from './image/map/marker-icon-cruise.png';
import iconParty from './image/map/marker-icon-party.png';
import exchangeMapIcon from './image/map/exchange-marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

import './css/App.css';
import './css/map.css';
import './css/event-datatable.css';
import './css/event-filter.css';
import './css/event-details.css';

import { AccessAlarm, MenuBookRounded, BadgeRounded, DesktopWindowsRounded,
    StyleRounded, LocationOnRounded, CalendarMonthRounded,
    MicNoneRounded, Apartment, Bungalow,
    WorkspacePremium, EmojiEvents, Sailing} from '@mui/icons-material';

import 'primereact/resources/themes/fluent-light/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';
import 'leaflet/dist/leaflet.css';


function App() {
    const toast = useRef(null);
    const [danceEvents, setDanceEvents] = useState([]);
    const [danceEvent, setDanceEvent] = useState({
        title: "",
        description: "",
        website: "",
        startFrom: "2023-01-01",
        finishTo: "2023-01-01",
        genres: [],
        teachers: [],
        orgs: [],
        bands: [],
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
    const [danceEventFilter, setDanceEventFilter] = useState({
        genres: "",
        locations: "",
        types: ""
    });
    const [displayDialog, setDisplayDialog] = useState(false);
    const [filterName, setFilterName] = useState("");
    const [filterStartFrom, setFilterStartFrom] = useState(new Date());
    const [filterFinishTo, setFilterFinishTo] = useState("");
    const [filterGenres, setFilterGenres] = useState([{code: "BL"}]);
    const [filterCountries, setFilterCountries] = useState("");
    const [filterTypes, setFilterTypes] = useState("");
    const [loading, setLoading] = useState(false);
    const [reset, setReset] = useState(false);

    let defaultIcon = L.icon({
        iconUrl: icon,
        //shadowUrl: iconShadow,
        iconSize : [28,42], // size of the icon
        iconAnchor : [14,42], // point of the icon which will correspond to marker's location
        popupAnchor : [0, 0] // point from which the popup should open relative to the iconAnchor
    });

    let exchangeIcon = L.icon({
        iconUrl: iconParty,
        //shadowUrl: iconShadow,
        iconSize : [28,42], // size of the icon
        iconAnchor : [14,42], // point of the icon which will correspond to marker's location
        popupAnchor : [0, 0] // point from which the popup should open relative to the iconAnchor
    });

    let campIcon = L.icon({
        iconUrl: iconCamp,
        //shadowUrl: iconShadow,
        iconSize : [28,42], // size of the icon
        iconAnchor : [14,42], // point of the icon which will correspond to marker's location
        popupAnchor : [0, 0] // point from which the popup should open relative to the iconAnchor
    });

    let cruiseIcon = L.icon({
        iconUrl: iconCruise,
        //shadowUrl: iconShadow,
        iconSize : [28,42], // size of the icon
        iconAnchor : [14,42], // point of the icon which will correspond to marker's location
        popupAnchor : [0, 0] // point from which the popup should open relative to the iconAnchor
    });


    L.Marker.prototype.options.icon = defaultIcon;

    ReactGA.initialize("G-LXQVZMZGQT");

    addLocale('en-sw', {
        firstDayOfWeek: 1,

    });
    /*PrimeFaces.locales['en_GB'] = {
        firstDay : 1
    };*/

    useEffect(() => {
        loadFilterData();
        loadData();
    }, []);

    const loadFilterData = () => {
        fetch(`http://ec2-16-16-96-223.eu-north-1.compute.amazonaws.com:8080/api/danceEvents/filter`)
            .then(res => res.json())
            .then(data => setDanceEventFilter(data),
                // Note: it's important to handle errors here
                // instead of a catch() block so that we don't swallow
                // exceptions from actual bugs in components.
                (error) => {
                    toast.current.show({ severity: 'error', summary: 'Error', detail: error, life: 3000 });
                }
            ).then(data => {
        })
    }

    const loadData = () => {
        setLoading(true);
        let params = {
            "startFrom": filterStartFrom.toISOString().substring(0, 10)
        }

        if (filterName) {
            params['title'] = filterName;
        }

        if (filterFinishTo) {
            params['finishTo'] = filterFinishTo.toISOString().substring(0, 10);
        }

        if (typeof filterGenres !== 'undefined' && filterGenres.length > 0) {
            params['genres'] = filterGenres.map(a => a.code);
        }

        if (typeof filterCountries !== 'undefined' && filterCountries.length > 0) {
            params['locations'] = filterCountries.map(a => a.code);
        }

        if (typeof filterTypes !== 'undefined' && filterTypes.length > 0) {
            params['types'] = filterTypes.map(a => a.code);
        }

        fetch(`http://ec2-16-16-96-223.eu-north-1.compute.amazonaws.com:8080/api/danceEvents/?` + new URLSearchParams(params))
            .then(res => res.json())
            .then(data => setDanceEvents(data),
                // Note: it's important to handle errors here
                // instead of a catch() block so that we don't swallow
                // exceptions from actual bugs in components.
                (error) => {
                    toast.current.show({ severity: 'error', summary: 'Error', detail: error, life: 3000 });
                }
            ).then(data => {
                setLoading(false);
        })
    }

    const resetData = () => {
        setLoading(true);
        let currentDate = new Date();

        let params = {
            "startFrom": currentDate.toISOString().substring(0, 10)
        }

        fetch(`http://ec2-16-16-96-223.eu-north-1.compute.amazonaws.com:8080/api/danceEvents/?` + new URLSearchParams(params))
            .then(res => res.json())
            .then(data => setDanceEvents(data),
                (error) => {
                    toast.current.show({ severity: 'error', summary: 'Error', detail: error, life: 3000 });
                }
            ).then(data => {
                resetFilterData();
            })
            .then(data => {
                setLoading(false);
        })
    }

    const applyFilter = () => {
        loadData();
    }

    const resetFilterData = () => {
        setFilterStartFrom(new Date());
        setFilterName("");
        setFilterFinishTo("");
        setFilterTypes("");
        setFilterCountries("");
        setFilterGenres("");
    }

    const resetFilter = () => {
        resetData();
    }

    const onClick = (data) => {
        ReactGA.event({
          category: "festivals",
          action: "open festival",
          label: data.title, // optional
        });

        setDanceEvent(data);
        setDisplayDialog(true);
    }

    const onHide = () => {
        setDisplayDialog(false);
    }

    const handleFilterNameChange = (e) => {
        setFilterName(e.target.value);
    };

    const handleFilterStartFromChange = (e) => {
        setFilterStartFrom(e.target.value);
    };

    const handleFilterFinishToChange = (e) => {
        setFilterFinishTo(e.target.value);
    };

    const handleFilterGenreChange = (e) => {
        setFilterGenres(e.target.value);
    };

    const handleFilterCountriesChange = (e) => {
        setFilterCountries(e.target.value);
    };

    const handleFilterTypesChange = (e) => {
        setFilterTypes(e.target.value);
    };

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

    const countrySelectTemplate = (option) => {
        return (
            <div className="flex align-items-center">
                <img alt={option.title} src={`icons/flags/${option.code}.svg`} className={`mr-2 flag flag-${option.code.toLowerCase()}`} style={{ width: '18px' }} />
                <div>{option.title}</div>
            </div>
        );
    };

    const genreSelectTemplate = (option) => {
        return (
            <div className="flex align-items-center">
                <div className={`${option.code}`}><span>{option.title}</span></div>
            </div>
        );
    };

    const eventTitleTemplate = (data) => {

        var newLable = "";
        var ongoingLable = "";
        if (data.newEvent) {
            newLable = (<Tag className="mr-2" severity="success" value="new"></Tag>);
        }

        if(data.ongoingEvent) {
            ongoingLable = (<span className="ongoing-label"><i className="pi pi-circle-fill" style={{ fontSize: '8px' }}></i></span>);
        }

        var teachers = "";
        if (data.exchange) {
            teachers = (<Chip label="Exchange" />)
        } else if (data.teachers && data.teachers.length > 0) {
            teachers = (
                <AvatarGroup className="teachers"
                             data-pr-position="right">
                    <Tooltip target=".teachers"/>
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
                        {ongoingLable}
                        <span className="event-title" onClick={event => onClick(data)}>{data.title}</span>
                        {newLable}
                    </div>
                    {teachers}
                </div>
            </React.Fragment>
        );
    }

    const eventTeachersList = (data) => {

        let maxIcons = 12;

        let rand = Math.floor(Math.random() * 10000) + 1;

        let tchClassName = "teachers " + "tch-" + rand;
        let tchSelector = ".tch-" + rand;
        var teachers = "";
        if (data.exchange) {
            teachers = (<Chip label="Exchange" />)
        } else if (data.teachers && data.teachers.length > 0) {
            if (data.teachers.length < maxIcons) {
                teachers = (
                    <React.Fragment>
                        <AvatarGroup className={tchClassName} data-pr-position="right">
                            {data.teachers.map(d => (<Avatar image={d.profilePictureSrc}
                                                             title={d.displayName}
                                                             imageAlt={d.displayName}
                                                             label={d.displayName.match(/\b(\w)/g).join('')}
                                                             shape="circle"/>))}
                        </AvatarGroup>
                        <Tooltip target={tchSelector}>
                            <span>
                                {data.teachers
                                    .sort(function(a,b){return (a.displayName > b.displayName) ? 1 : ((b.displayName > a.displayName) ? -1 : 0);})
                                    .map(d => (<span>{d.displayName}<br/></span>
                                    ))}
                            </span>
                        </Tooltip>
                    </React.Fragment>
                )
            } else {
                let otherCountInt = data.teachers.length - maxIcons + 2;
                let otherCount = "+" + otherCountInt;
                teachers = (

                    <React.Fragment>
                        <AvatarGroup className={tchClassName} data-pr-position="right">
                            {data.teachers.slice(0, maxIcons - 2).map(d => (<Avatar image={d.profilePictureSrc}
                                                             title={d.displayName}
                                                             imageAlt={d.displayName}
                                                             label={d.displayName.match(/\b(\w)/g).join('')}
                                                             shape="circle"/>))}
                            {(<Avatar
                                  title={otherCount}
                                  imageAlt={otherCount}
                                  label={otherCount}
                                  shape="circle"/>)}
                        </AvatarGroup>
                        <Tooltip target={tchSelector}>
                            <span>
                                {data.teachers
                                    .sort(function(a,b){return (a.displayName > b.displayName) ? 1 : ((b.displayName > a.displayName) ? -1 : 0);})
                                    .map(d => (<span>{d.displayName}<br/></span>
                                    ))}
                            </span>
                        </Tooltip>
                    </React.Fragment>
                )
            }
        }

        return teachers;
    }

    const eventShortTitleTemplate = (data) => {
            var newLable = "";
            var ongoingLable = "";
            if (data.newEvent) {
                newLable = (<Tag className="mr-2" severity="success" value="new"></Tag>);
            }

            if(data.ongoingEvent) {
                ongoingLable = (<span className="ongoing-label"><i className="pi pi-circle-fill" style={{ fontSize: '8px' }}></i></span>);
            }

            var campIcon = "";
            if (data.camp) {
                /*campIcon = (<Chip icon="pi pi-home" className="camp-icon" />)*/
                campIcon = (<span className="camp-icon" title="Camp" ><Apartment /></span>)
            } else
            if (data.cruise) {
               /*campIcon = (<Chip icon="pi pi-home" className="camp-icon" />)*/
               campIcon = (<span className="camp-icon" title="Cruise" ><Sailing /></span>)
           }


            let rand = Math.floor(Math.random() * 10000) + 1;

            var liveMusic = "";
            let lmClassName = "live-music " + "lm-" + rand;
            let lmSelector = ".lm-" + rand;
            if (data.bands && data.bands.length > 0) {
                liveMusic = (
                    <span className={lmClassName} data-pr-position="right">
                        <Chip label="Live music" icon="pi pi-microphone" />
                        <Tooltip target={lmSelector}>
                            <span>
                            {data.bands.map(d => (<span>{d.title}<br/></span>
                                ))}
                            </span>
                        </Tooltip>
                    </span>
                )
            }

            var competitions = "";
            if (data.competitions) {
                //competitions = (<span className="comp-icon" title="Competitions" ><EmojiEvents /></span>)
            }

            return (
                <React.Fragment>
                    <div className="flex justify-content-between flex-wrap title-container">
                        <div>
                            {campIcon}
                            {ongoingLable}
                            <span className="event-title" onClick={event => onClick(data)}>{data.title}</span>
                            {newLable}
                        </div>
                        <div>
                            {data.genres.map(d => (<Chip label={d.code} className={`mr-2 mb-2 ${d.code}`} title={d.title} key={d.code} />))}
                        </div>
                    </div>
                    <div className="flex justify-content-between flex-wrap teachers-container">
                        <div className="flex">
                            {eventTeachersList(data)}
                            {liveMusic}
                            {competitions}
                        </div>
                        <div>
                            <span>{data.locationCity}&nbsp;</span>
                            <span><img alt={data.locationCountryName}
                                    src={`icons/flags/${data.locationCountry}.svg`}
                                    height={"16px"} className="flag-icon" />
                            </span>
                        </div>

                    </div>
                </React.Fragment>
            );
        }

    const eventLocationTemplate = (data) => {
        return (
            <React.Fragment>
                <span><img alt={data.locationCountryName} src={`icons/flags/${data.locationCountry}.svg`} height={"16px"} className="flag-icon" /></span>
                <span>{data.locationCountryName},&nbsp;</span>
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

    const eventShortDurationWeekTemplate = (data) => {

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

            return (
                <React.Fragment>
                    <div className="duration">
                        {durationWeeks}
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
                      inline disabled={true} selectionMode="range" locale="en-sw"/>
        );
    }

    const renderFilter = () => {
        return (
            <div id="filter-holder">
                <div className="filter-row">
                    <Calendar value={filterStartFrom} onChange={handleFilterStartFromChange} showIcon readOnlyInput />
                    <span className="arrow-icon pi pi-arrow-right"></span>
                    <Calendar value={filterFinishTo} onChange={handleFilterFinishToChange} showIcon readOnlyInput />
                    <span className="p-input-icon-left">
                        <i className="pi pi-search" />
                        <InputText value={filterName} onChange={handleFilterNameChange}
                                   className="filter-name" placeholder="Name contain"/>
                    </span>
                    <Button label="Filter" icon="pi pi-check" loading={loading}
                            onClick={applyFilter} className="filter-button"/>
                    <Button icon="pi pi-times" loading={loading} onClick={resetFilter}
                            aria-label="Filter" className="reset-button"/>
                </div>
                <div className="filter-row">
                    <i className="filer-icon pi pi-building" />
                    <MultiSelect value={filterTypes} onChange={handleFilterTypesChange} options={danceEventFilter.types}
                                 optionLabel="title" display="chip"
                                 placeholder="All types" maxSelectedLabels={3} />

                    <i className="filer-icon pi pi-map-marker" />
                    <MultiSelect value={filterCountries} onChange={handleFilterCountriesChange} options={danceEventFilter.locations}
                                 optionLabel="title" display="chip"
                                 placeholder="All countries" maxSelectedLabels={3}
                                 itemTemplate={countrySelectTemplate}/>

                    <i className="filer-icon pi pi-tags" />
                    <MultiSelect value={filterGenres} onChange={handleFilterGenreChange} options={danceEventFilter.genres}
                                 optionLabel="title" display="chip"
                                 placeholder="All genres" maxSelectedLabels={3}
                                 itemTemplate={genreSelectTemplate}/>
                </div>
            </div>
        )
    }

    const renderShortFilter = () => {
            return (
            <React.Fragment>
                <div className="filter-short-holder">
                    <span>qwertyuil</span>
                </div>
            </React.Fragment>
            )
        }

    const renderEventList = () => {
        return (
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
        )
    }

    const renderEventShortList = () => {
            return (
                <DataTable value={danceEvents}
                           className="event-table-list"
                           sortMode="single" sortField="startFrom" sortOrder={1}
                           rowGroupMode="subheader" groupRowsBy="eventListGroping"
                           rowGroupHeaderTemplate={headerTemplate}
                           scrollable
                           responsiveLayout="scroll"
                           rowClassName="event-list-row">

                    <Column body={eventShortDurationTemplate} style={{ maxWidth: '150px' }}></Column>
                    <Column body={eventShortTitleTemplate}></Column>
                </DataTable>
            )
        }

    const eventShortDurationTemplate = (data) => {
           const startFrom = new LocalDate(data.startFrom);
           var finishTo = new LocalDate(data.finishTo);

           return (
               <React.Fragment>
               <div className="flex align-items-center flex-no-wrap">
                   <div className="duration">
                       <span className="duration-from">{startFrom.getDate()}</span>
                       <span> - </span>
                       <span className="duration-to">{finishTo.getDate()}</span>
                   </div>
                   <div>
                        {eventShortDurationWeekTemplate(data)}
                   </div>
               </div>
               </React.Fragment>
           );
       }

    const renderEventMap = () => {
            return (
                <div id="map-holder">
                    <MapContainer zoom={4} center={[55,40]}
                            scrollWheelZoom={true} style={{width: '100%', height: '100vh', position: 'fixed'}}>
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            //url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            //url = "https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png"
                            //url = "https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png"
                            //url = "https://tiles.stadiamaps.com/tiles/stamen_toner/{z}/{x}/{y}{r}.png"
                            //url = "https://tiles.stadiamaps.com/tiles/stamen_toner_lite/{z}/{x}/{y}{r}.png"
                            //url = "https://tiles.stadiamaps.com/tiles/stamen_terrain/{z}/{x}/{y}{r}.png"
                            url = "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}"
                          />
                        <MarkerClusterGroup
                              chunkedLoading
                              maxClusterRadius={10}
                              spiderfyOnMaxZoom={true}
                            >
                            {danceEvents.length > 0 &&
                                     danceEvents
                                     .filter(function(danceEvent) {
                                          return danceEvent.locationLat != null;
                                        }).map((danceEvent) => (

                                       <Marker
                                         position={[
                                           danceEvent.locationLat,
                                           danceEvent.locationLong
                                         ]}
                                         eventHandlers={{
                                            click: () => {
                                                onClick(danceEvent);
                                            }
                                         }}
                                         icon={getMapIcon(danceEvent)}
                                       >
                                         <LeafletTooltip>
                                            <div className="event-map-tooltip">
                                                <div className="title">{danceEvent.title}</div>
                                                <div className="duration">
                                                    {danceEvent.duration.durationStr}
                                                </div>
                                                <div className="location">
                                                    <span>
                                                        <img alt={danceEvent.locationCountryName}
                                                                src={`icons/flags/${danceEvent.locationCountry}.svg`}
                                                                height={"12px"} className="flag-icon" />
                                                    </span>

                                                    <span>{danceEvent.locationCity}</span>
                                                </div>
                                                <div className="flex align-items-center flex-no-wrap genres">
                                                    {danceEvent.genres.map(d => (<Chip label={d.title} className={`mr-2 mb-2 ${d.code}`} title={d.title} key={d.code} />))}
                                                </div>
                                            </div>
                                         </LeafletTooltip>
                                       </Marker>
                                     ))}
                            }
                        </MarkerClusterGroup>
                    </MapContainer>
                </div>
            );
        }

    const getMapIcon = (data) => {
        if (data.camp) {
            return campIcon;
        }

        if (data.cruise) {
            return cruiseIcon;
        }

        if (data.exchange) {
            return exchangeIcon;
        }
        return defaultIcon;
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
            <CookieConsent>This website uses cookies to enhance the user experience.</CookieConsent>
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
                            <div className="col">
                                <div className="flex align-items-center flex-wrap">
                                    {danceEvent.genres.map(d => (<Chip label={d.title} className={`mr-2 mb-2 ${d.code}`} title={d.title} key={d.code} />))}
                                </div>
                            </div>
                        </div>
                        <div className="grid">
                            <div className="col"><a target="_blank" href={danceEvent.website} rel="noopener">{danceEvent.website}</a></div>
                        </div>
                        <div className="grid">
                            <div className="col">{danceEvent.description}</div>
                        </div>
                        <div className="grid">
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
                                    <span>{danceEvent.teacherStr}</span>
                                </div>
                            </div>
                        </div>
                        <div className="grid">
                            <div className="col">
                                {danceEvent.bands.map(d => (<span>{d.title}<br/></span>
                                                                                 ))}
                            </div>
                        </div>
                        <div className="grid">
                            <div className="col">
                                {danceEvent.orgs.map(d => (<span>{d.title}<br/></span>
                                                                                 ))}
                            </div>
                        </div>

                    </div>
                    <div className="flex flex-column" style={{width: '300px'}}>
                        <div className="grid">
                            <div className="col-fixed" style={{width: '40px'}}>
                                <CalendarMonthRounded />
                            </div>
                            <div className="col">
                                <span className="duration-str">{danceEvent.duration.durationStr}</span>
                            </div>
                        </div>
                        {renderCalendar()}
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
                        <div className="map" style={{width: '300px', height: '300px'}}>
                            <MapContainer center={[danceEvent.locationLat, danceEvent.locationLong]} zoom={7}
                                          scrollWheelZoom={false} style={{width: '300px', height: '300px'}}>
                                <TileLayer
                                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                    url = "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}"
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
                {renderEventMap()}

                <div id="content-holder">
                    <div id="dance-event-list">
                        {renderEventShortList()}
                    </div>
                </div>
            </content>

        </div>
    );
}

export default App;
