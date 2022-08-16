import React, { useEffect, ReactElement, useRef, EffectCallback } from "react";
import Marker from "./Marker";
import { Wrapper, Status } from "@googlemaps/react-wrapper";
import { createCustomEqual } from "fast-equals";
import { isLatLngLiteral } from "@googlemaps/typescript-guards";
import { margin } from "@mui/system";

interface MapProps extends google.maps.MapOptions {
    style: { [key: string]: string };
    onClick?: (e: google.maps.MapMouseEvent) => void;
    onIdle?: (map: google.maps.Map) => void;
    from?: { lat: number, lng: number } | undefined
    to?: { lat: number, lng: number } | undefined
}

const render = (status: Status): ReactElement => {
    if (status === Status.LOADING) return <h3>{status} ..</h3>;
    if (status === Status.FAILURE) return <h3>{status} ...</h3>;
    return <div>{status}</div>;
};

interface MapProps extends google.maps.MapOptions {
    style: { [key: string]: string };
    onClick?: (e: google.maps.MapMouseEvent) => void;
    onIdle?: (map: google.maps.Map) => void;
    children?: React.ReactNode;
}
const deepCompareEqualsForMaps = createCustomEqual(
    // @ts-ignore
    (deepEqual) => (a: any, b: any) => {
        if (
            isLatLngLiteral(a) ||
            a instanceof google.maps.LatLng ||
            isLatLngLiteral(b) ||
            b instanceof google.maps.LatLng
        ) {
            return new google.maps.LatLng(a).equals(new google.maps.LatLng(b));
        }
        // @ts-ignore
        return deepEqual(a, b);
    }
);

function useDeepCompareMemoize(value: any) {
    const ref = useRef();
    if (!deepCompareEqualsForMaps(value, ref.current)) {
        ref.current = value;
    }
    return ref.current;
}

function useDeepCompareEffectForMaps(
    callback: React.EffectCallback,
    dependencies: any[]
) {
    useEffect(callback, dependencies.map(useDeepCompareMemoize));
}

const Map: React.FC<MapProps> = ({
    onClick,
    onIdle,
    style,
    children,
    from,
    to,
    ...options
}) => {
    const ref = React.useRef<HTMLDivElement>(null);
    const [map, setMap] = React.useState<google.maps.Map>();
    const [lines, setLines] = React.useState<google.maps.Polyline>();

    useDeepCompareEffectForMaps(() => {
        if (map) {
            map.setOptions(options);
        }
    }, [map, options]);

    useEffect(() => {
        const lineSymbol = {
            path: "M 0,-1 0,1",
            strokeOpacity: 1,
            scale: 4,
        };

        if (ref.current && !map) {
            setMap(new window.google.maps.Map(ref.current, {}));
        } else {
            if (from && to) {
                if (!lines) {
                    const newLine = new google.maps.Polyline({
                        path: [
                            from,
                            to
                        ],
                        strokeOpacity: 0,
                        icons: [
                            {
                                icon: lineSymbol,
                                offset: "0",
                                repeat: "20px",
                            },
                        ],
                        geodesic: true,
                        strokeColor: '#002B5B',
                        strokeWeight: 1,
                    });

                    newLine.setMap(map);
                    setLines(newLine);
                } else {
                    lines.setMap(null)
                    lines.setPath([from, to])
                    lines.setMap(map);
                }
            }
        }
    }, [ref, map, from, to, lines]);



    return (
        <>
            <div ref={ref} style={style} />
            {React.Children.map(children, (child) => {
                if (React.isValidElement(child)) {
                    // set the map prop on the child component
                    return React.cloneElement(child, { map });
                }
            })}
        </>
    );
};

function MapWrapper(props: any) {
    const center = { lat: 36.2444175, lng: -100.7349631 };
    const zoom = 3.5;
    const style = {
        height: '100%',
        width: '100%',
        borderRadius: '20px',
    }
    const { from, to } = props;


    return (
        <div className="container-map">
            <Wrapper apiKey={'AIzaSyBdKBdFgvYQEZTRxaxQue17XnfShUrGy0Y'} render={render}>
                <Map from={from} to={to} center={center} zoom={zoom} style={style}>
                    {from && <Marker icon='airport.png' position={{ lat: from.lat, lng: from.lng }} />}
                    {to && <Marker icon='airport.png' position={{ lat: to.lat, lng: to.lng }} />}
                </Map>
            </Wrapper>
        </div>
    );
}

export default MapWrapper;