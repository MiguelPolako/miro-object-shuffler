# Object Shuffler - Official Miro App

A Miro app that allows users to randomly shuffle the positions of selected objects on their boards.

## Features

- **Smart Selection**: Automatically detects when 2 or more objects are selected
- **Random Positioning**: Generates new random positions within a calculated area
- **Collision Prevention**: Ensures objects don't overlap after shuffling
- **Smooth Experience**: Clean UI with real-time feedback and status updates
- **Safe Boundaries**: Keeps objects within reasonable proximity to their original locations

## Installation for Development

1. **Set up Miro Developer Account**:
   - Go to [Miro Developer Platform](https://developers.miro.com/)
   - Sign in with your Miro account
   - Create a new app

2. **Configure App Settings**:
   - App Name: "Object Shuffler"
   - App URL: Your deployment URL (e.g., `https://yourapp.replit.app/`)
   - Redirect URI: Same as App URL
   - Scopes: `boards:read`, `boards:write`

3. **Install in Miro**:
   - Go to your Miro board
   - Click the "+" button in the left sidebar
   - Search for your app name or use the development installation link

## Usage

1. **Open the App**: Click on "Object Shuffler" in your Miro board's left sidebar
2. **Select Objects**: Choose 2 or more objects on your board
3. **Shuffle**: Click the "Shuffle Objects" button in the app panel
4. **Watch**: Objects will smoothly move to new random positions

## Technical Details

- **Built with**: Miro SDK v2
- **Frontend**: Vanilla JavaScript, HTML5, CSS3
- **Hosting**: Compatible with any web hosting service
- **No Backend Required**: Runs entirely client-side

## Publishing to Miro Marketplace

To make this an official Miro app available to all users:

1. **Complete Development**: Ensure all features work correctly
2. **Submit for Review**: Use Miro's app review process
3. **Marketplace Approval**: Wait for Miro team approval
4. **Public Release**: App becomes available in Miro's app marketplace

## Local Development

1. Start the local server: `python3 -m http.server 5000`
2. Use `http://localhost:5000/` as your app URL in Miro developer settings
3. Test directly in your Miro boards

## File Structure

- `index.html` - Main app interface
- `app.js` - Core application logic and Miro SDK integration
- `app.yaml` - Miro app configuration
- `README.md` - Documentation
