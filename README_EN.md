# SVG Converter Tool

English | [中文](README.md)

A simple and easy-to-use web application for converting SVG code to PNG image format.

## Features

- **SVG Preview**: Real-time preview of SVG code effects
- **PNG Conversion**: Convert SVG code to PNG image
- **One-Click Copy**: Directly copy the converted PNG image to clipboard
- **Image Download**: Download the converted PNG image to local storage
- **Beautiful Interface**: Adopts glass-morphism design, modern and clean visual effect
- **Responsive Layout**: Adapts to devices with different screen sizes
- **PWA Support**: Can be installed on devices and used offline

## How to Use

1. Enter or paste SVG code in the left text box
2. Click the "Preview" button to view the SVG effect
3. Click the "Convert to PNG" button to convert SVG to PNG format
4. After conversion, you can choose to:
   - Click "Copy Image" to copy the PNG to clipboard
   - Click "Download Image" to save the PNG to local storage

## Technical Implementation

- Pure frontend implementation, no server support required
- Uses HTML5 Canvas API for image conversion
- Utilizes Blob and Data URL for image data processing
- Uses Clipboard API for image copying functionality

## Local Setup

1. Clone or download this repository to your local machine
2. Open the `index.html` file directly with a browser
3. No need to install any dependencies, ready to use immediately

## Browser Compatibility

- Supports all modern browsers (Chrome, Firefox, Edge, Safari, etc.)
- Image copying feature requires browser support for Clipboard API

## Example

The tool provides a simple SVG example code by default. You can directly click the preview and conversion buttons to experience the functionality. You can also replace it with your own SVG code for conversion.

## PWA Installation and Usage

This application supports PWA (Progressive Web App) functionality, allowing you to install it on your device and use it offline:

1. Access the application using modern browsers like Chrome, Edge, or Safari
2. Click the "Install" icon in the browser's address bar (or select "Install app" from the menu)
3. Once installed, the application will run on your device like a native app