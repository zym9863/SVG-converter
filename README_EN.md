# SVG Converter Tool

English | [中文](README.md)

A simple and easy-to-use web application for converting SVG code to PNG image format.

## Features

- **SVG Real-time Preview**: Automatically preview SVG code effects as you type
- **Automatic PNG Conversion**: Automatically convert SVG code to PNG image without manual operation
- **One-Click Copy**: Directly copy the converted PNG image to clipboard
- **Image Download**: Download the converted PNG image to local storage
- **Beautiful Interface**: Adopts glass-morphism design, modern and clean visual effect
- **Responsive Layout**: Adapts to devices with different screen sizes
- **PWA Support**: Can be installed on devices and used offline

## How to Use

1. Enter or paste SVG code in the left text box
2. The SVG effect will automatically display in the preview area on the right
3. PNG conversion happens automatically, no manual operation needed
4. You can choose to:
   - Click "Copy Image" to copy the PNG to clipboard
   - Click "Download Image" to save the PNG to local storage
5. Click on the preview area to view SVG in fullscreen mode

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

The tool provides a simple SVG example code by default. The preview and conversion will happen automatically as soon as you load the page. You can replace the example with your own SVG code for conversion.

## PWA Installation and Usage

This application supports PWA (Progressive Web App) functionality, allowing you to install it on your device and use it offline:

1. Access the application using modern browsers like Chrome, Edge, or Safari
2. Click the "Install" icon in the browser's address bar (or select "Install app" from the menu)
3. Once installed, the application will run on your device like a native app