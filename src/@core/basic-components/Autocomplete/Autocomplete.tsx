import React, { useEffect, useRef } from "react";
import MapsLoaderService from "utils/maps.loader.util";
import Input from "@core/basic-components/Input";

const Autocomplete = ({ val, value, setAddress, setError, name, ...rest }: any) => {
  const autocompleteInput = useRef<any>(null);
  const autocompleteInstance = useRef<any>(null);

  const initAutoComplete = () => {
    const google = (window as any).google;

    autocompleteInstance.current = new google.maps.places.Autocomplete(
      autocompleteInput.current!,
      { componentRestrictions: { country: "pk" } }
    );

    autocompleteInstance.current.addListener(
      "place_changed",
      handlePlaceSelect
    );
    autocompleteInstance.current.addListener(
      "place_changed",
      handlePlaceSelect
    );

    return () => {
      if (autocompleteInstance.current) {
        google.maps.event.clearInstanceListeners(
          autocompleteInstance.current
        );
      }
    };
  };

  useEffect(() => {
    MapsLoaderService.LoadScripts();
    MapsLoaderService.subscribe(initAutoComplete);
  }, []);

  useEffect(() => {
    return () => {
      MapsLoaderService.unsubscribe(initAutoComplete);
    };
  }, []);

  useEffect(() => {
    if (!MapsLoaderService.mapsLoaded) {
      MapsLoaderService.subscribe(initAutoComplete);
    } else {
      initAutoComplete();
    }
  }, []);

  const handlePlaceSelect = () => {
    if (autocompleteInstance.current) {
      const place = autocompleteInstance.current.getPlace();

      if (!place?.geometry) {
        // setError("Address not found");
        return;
      }

      const latitude = place.geometry.location.lat();
      const longitude = place.geometry.location.lng();

      let zipcode, door, street, city, state, country;

      const addressComponents = place.address_components;

      for (let i = 0; i < addressComponents.length; i++) {
        const component = addressComponents[i];

        if (component.types.includes("locality")) {
          city = component.long_name;
        }
        if (component.types.includes("administrative_area_level_1")) {
          state = component.long_name;
        }
        if (component.types.includes("postal_code")) {
          zipcode = component.long_name;
        }
        if (component.types.includes("street_number")) {
          door = component.long_name;
        }
        if (component.types.includes("route")) {
          street = component.long_name;
        }
        if (component.types.includes("country")) {
          country = component.long_name;
        }
      }
      // if (!door) {
      //   setError("Please enter street/house number");
      // } else setError("");
      const address = {
        title: place.name,
        lat: latitude,
        lng: longitude,
        postalCode: zipcode,
        street,
        city,
        country,
        state,
        detail: place.formatted_address,
      };
      setAddress({value: place.formatted_address,details: address});
      // setAddress(`${name}`, address, {
      //   shouldValidate: true,
      //   shouldDirty: true,
      // });

    }
  };

  return (

    <Input
      inputRef={autocompleteInput}
      placeholder={`Enter ${rest.label} Location`}
      {...rest}
      value={val?.value || ""}
      label={val?.details?.name || rest.label}
      onChange={(e) => setAddress({ value: e.target.value })}
      onKeyDown={(e) => {
        rest.onKeyDown?.(e);
        if (e.key === "Enter") e.preventDefault();
      }}
    />
  );
}

Autocomplete.displayName = "Autocomplete";
export default Autocomplete;
