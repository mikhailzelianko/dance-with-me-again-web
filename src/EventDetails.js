import React, { useState, useEffect, useRef } from 'react';
import { useParams } from "react-router";
import {Helmet} from "react-helmet";
import { Chip } from 'primereact/chip';
import { Calendar } from 'primereact/calendar';
import {LocalDate} from "local-date";
import { locale, addLocale, updateLocaleOption, updateLocaleOptions, localeOption, localeOptions } from 'primereact/api';

import { useMap } from 'react-leaflet'
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import { MapContainer, Marker, Popup, TileLayer, Tooltip as LeafletTooltip} from 'react-leaflet'

import './css/App.css';
import './css/event-details.css';

import icon from './image/map/marker-icon-clear.png';

import { AccessAlarm, MenuBookRounded, BadgeRounded, DesktopWindowsRounded,
    StyleRounded, LocationOnRounded, CalendarMonthRounded,
    MicNoneRounded, Apartment, Bungalow,
    WorkspacePremium, EmojiEvents, Sailing} from '@mui/icons-material';

function EventDetails() {

    let { eventId } = useParams();

    const [loading, setLoading] = useState(false);

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

    addLocale('en-sw', {
        firstDayOfWeek: 1,

    });

    let defaultIcon = L.icon({
        iconUrl: icon,
        //shadowUrl: iconShadow,
        iconSize : [28,42], // size of the icon
        iconAnchor : [14,42], // point of the icon which will correspond to marker's location
        popupAnchor : [0, 0] // point from which the popup should open relative to the iconAnchor
    });

    L.Marker.prototype.options.icon = defaultIcon;

    const renderTeachersBlock = () => {
        var header = ""
        if (danceEvent.teachers && danceEvent.teachers.length > 0) {
            header = (<div className="header">Instructors</div>)
        }
        return (
            <div className="teachers-block">
                {header}
                <div className="flex flex-row flex-wrap card-container">
                    {danceEvent.teachers.map(d => (
                        <Chip label={d.displayName} image={d.profilePictureSrc} />
                    ))}
                    <span>{danceEvent.teacherStr}</span>
                </div>
            </div>
        )
    }

    const renderBandsBlock = () => {
        var header = ""
        if (danceEvent.bands && danceEvent.bands.length > 0) {
            header = (<div className="header">Live music</div>)
        }
        return (
            <div className="bands-block">
                {header}
                {danceEvent.bands.map(d => (
                <React.Fragment>
                    <Chip label={d.title} icon="pi pi-microphone" />
                </React.Fragment>
                                                                 ))}
            </div>
        )
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

    useEffect(() => {
        loadData();
    }, []);

    const loadData = () => {
            setLoading(true);

            fetch(`http://localhost:8080/api/danceEvents/` + eventId)
                .then(res => res.json())
                .then(data => setDanceEvent(data),
                    // Note: it's important to handle errors here
                    // instead of a catch() block so that we don't swallow
                    // exceptions from actual bugs in components.
                    (error) => {
                        /*toast.current.show({ severity: 'error', summary: 'Error', detail: error, life: 3000 });*/
                    }
                ).then(data => {
                    setLoading(false);
            })
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
                    <meta property="og:image" content="http://swingwithme.today/images/swm.png" />
                    { /* End Facebook tags */ }
                    { /* Twitter tags }
                    <meta name="twitter:creator" content={name} />}
                    <meta name="twitter:card" content={type} />
                    <meta name="twitter:title" content='Swing with me' /> */ }
                    <meta name="twitter:description" content='Swing with me - calendar for Lindy hop, Balboa, Blues, Shag, Charlston festivals' />
                    { /* End Twitter tags */ }
                </Helmet>
                <content>
                    <div id="content">
                        <div className="card-container blue-container flex align-items-start justify-content-start details-dialog">
                            <div className="flex flex-column genres-container">

                                <div className="grid">
                                    <div className="col">
                                        <div className="flex align-items-center flex-wrap">
                                            {danceEvent.genres.map(d => (<Chip label={d.title} className={`mr-2 mb-2 ${d.code}`} title={d.title} key={d.code} />))}
                                        </div>
                                    </div>
                                </div>
                                <div className="grid">
                                    <div className="col link"><DesktopWindowsRounded/><a target="_blank" href={danceEvent.website} rel="noopener">{danceEvent.website}</a></div>
                                </div>
                                <div className="grid">
                                    <div className="col description" dangerouslySetInnerHTML={{__html: danceEvent.description.replace(/(?:\r\n|\r|\n)/g, '<br />')}} />
                                </div>
                                <div className="grid">
                                    <div className="col">
                                        {renderTeachersBlock()}
                                    </div>
                                </div>
                                <div className="grid">
                                    <div className="col">
                                        {renderBandsBlock()}
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
                                <div className="grid map-header">
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
                                <div>
                                        {danceEvent.orgs.map(d => (<span>{d.title}<br/></span>
                                                                                         ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </content>

            </div>
        );
}

export default EventDetails;