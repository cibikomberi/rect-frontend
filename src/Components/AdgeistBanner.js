import React, { useEffect, useRef } from "react";

export default function AdgeistBanner() {
    const adRef = useRef(null);

    useEffect(() => {
        // Load script only once
        const script = document.createElement("script");
        script.src = "https://d2cfeg6k9cklz9.cloudfront.net/creativebyadgeist.js";
        script.async = true;
        script.crossOrigin = "anonymous";
        script.setAttribute("data-env", process.env.NODE_ENV);
        document.body.appendChild(script);

        script.onload = () => {
            if (window.adsbyadgeist) {
                window.adsbyadgeist.push({});
            }
        };
console.log()
        return () => {
            // Cleanup if needed
            if (script.parentNode) {
                script.parentNode.removeChild(script);
            }
        };
    }, []);

    return (
        <ins
            ref={adRef}
            className="adsbyadgeist"
            style={{
                display: "inline-block",
                width: "360px",
                height: "360px",
                fontFamily: "Arial",
                color: "#63aa75"
            }}
            data-publisher-id={process.env.REACT_APP_ADGEIST_PUBLISHER_ID}
            data-api-key={process.env.REACT_APP_ADGEIST_API_KEY}
            data-ad-slot={process.env.REACT_APP_ADGEIST_AD_SLOT}
            data-slot-type="banner"
            data-responsive="false"
            data-allowed-formats="jpg,jpeg,png,gif,mp4"
        />
    );
}
