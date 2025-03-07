// utils/buttonStyles.js

export function setButtonStyles(generalInfo) {
    if (generalInfo) {
        // Set button text color from the home page data or default to '#fff'
        document.documentElement.style.setProperty(
            '--button-title-color',
            generalInfo.title_box_button_color || '#000'
        );

        // Set button background color from general info or default to '#000'
        document.documentElement.style.setProperty(
            '--button-color',
            generalInfo.button_color || '#000'
        );

        // Set button hover color from general info or default to '#555'
        document.documentElement.style.setProperty(
            '--button-hover-color',
            generalInfo.button_hover_color || '#555'
        );

        // Set button font style from general info or default to 'sans-serif'
        document.documentElement.style.setProperty(
            '--button-font-family',
            generalInfo.button_font || generalInfo.font_style || 'sans-serif'
        );
    }
}

export function setBoxStyles(homePageData) {
    if (homePageData) {
        // Set the background color of the box
        document.documentElement.style.setProperty(
            '--box-background-color',
            homePageData.title_box_color || '#fff'
        );

        // Set the background opacity of the box
        document.documentElement.style.setProperty(
            '--box-opacity',
            homePageData.title_box_opacity ? homePageData.title_box_opacity.toString() : '100'
        );
    }
}

export function setHeaderFontStyles(generalInfo) {
    if (generalInfo) {
        document.documentElement.style.setProperty(
            '--header-font-style',
            generalInfo.header_font || generalInfo.font_style || 'sans-serif'
        );
    }
}

export function setSubHeaderFontStyles(generalInfo) {
    if (generalInfo) {
        document.documentElement.style.setProperty(
            '--sub-header-font-style',
            generalInfo.subhead_font || generalInfo.font_style || 'sans-serif'
        );
    }
}