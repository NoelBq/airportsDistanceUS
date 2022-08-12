import React, { useEffect, ReactElement, useRef } from "react";
import Marker from "./Marker";
import { Wrapper, Status } from "@googlemaps/react-wrapper";
import { createCustomEqual } from "fast-equals";
import { isLatLngLiteral } from "@googlemaps/typescript-guards";

interface MapProps extends google.maps.MapOptions {
    style: { [key: string]: string };
    onClick?: (e: google.maps.MapMouseEvent) => void;
    onIdle?: (map: google.maps.Map) => void;
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
    ...options
}) => {
    const ref = React.useRef<HTMLDivElement>(null);
    const [map, setMap] = React.useState<google.maps.Map>();

    useDeepCompareEffectForMaps(() => {
        if (map) {
            map.setOptions(options);
        }
    }, [map, options]);

    useEffect(() => {
        if (ref.current && !map) {
            setMap(new window.google.maps.Map(ref.current, {}));
        }
    }, [ref, map]);

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

function MapWrapper(props:any) {
    const center = { lat: 36.2444175, lng: -100.7349631 };
    const zoom = 3.5;
    const style = { height: '100%', width: '100%' }
    const {from, to} = props;
    return (
        <Wrapper apiKey={'AIzaSyCiodgKm2fgsC7YceC-hcwjWNZBAseR5BQ'} render={render}>
            <Map center={center} zoom={zoom} style={style}>
                {from && <Marker position={{ lat: from.lat, lng: from.lng }} />}
                {to && <Marker position={{ lat: to.lat, lng: to.lng }} />}
            </Map>
        </Wrapper>
    );
}

export default MapWrapper;