# Weekly Sightings Chart

A lightweight React + TypeScript application that visualises daily sighting data (e.g. robin sightings from the office window) in an interactive weekly chart.  
The app automatically fills missing dates, groups data by week, and provides simple navigation to browse week by week.

---

## ✨ Features

- **📊 Weekly Data Visualisation** – Line chart of daily sightings, grouped by week (Monday–Sunday)
- **⏮️⏭️ Navigation Controls** – Easily browse between weeks using Previous / Next buttons
- **🧮 Data Normalisation** – Fills in missing dates with zero values for consistent charting
- **⚠️ Error Handling** – Displays friendly error messages and a reload button if data fails to load
- **📱 Responsive Design** – Clean, centred layout that scales smoothly across screen sizes

---

## 🧰 Technologies Used

- **React + TypeScript** – Modern, type-safe UI development
- **Recharts** – For interactive chart rendering
- **CSS (App.css)** – Custom styling for layout and chart controls
- **Fetch API** – Data retrieval from a JSON endpoint
- **Custom Hooks + Utility Modules** – For data transformation and reusability

---

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn package manager
- TypeScript knowledge for development and customisation

### Installation

1. Clone the repository:

```bash
git clone chart-display
cd weekly-sightings-chart
```

2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Start the development server:

```bash
npm start
# or
yarn start
```

4. Open [http://localhost:3000](http://localhost:3000) to view the application in your browser.

## Project Structure

src/
├─ components/
│ ├─ CustomTooltip.tsx # Custom tooltip for chart hover
│ ├─ SightingsChart.tsx # Recharts-based weekly chart
│ ├─ WeekNavigation.tsx # Next / Previous buttons
│
├─ hooks/
│ └─ useRobinData.ts # Fetch and prepare weekly data
│
├─ utils/
│ └─ dateUtils.ts # Date parsing, formatting, and week grouping
│
├─ types.ts # Shared TypeScript types
├─ App.tsx # Root component
├─ App.css # Styling

## How It Works

### Data Flow

### Data Processing

1. **Fetching**: useRobinData() fetches raw data from a JSON endpoint
2. **Normalisation**: fillMissingDates() fills any missing days and aligns weeks to Monday–Sunday
3. **Transformation**: splitIntoWeeks() groups the data into 7-day arrays
4. **Display**: App.tsx renders a <SightingsChart /> for the current week and provides <WeekNavigation /> buttons

### Navigation

- **Previous Week**: Navigate to the previous week's data, stops at week 1
- **Next Week**: Navigate to the next week's data, stops at the last week
- **Week Display**: Shows one complete week at a time for focused analysis
- **Reload**: Refetches data from the API if an error occurred

## Error Handling

The application includes robust error handling:

- User-friendly error messages when data fails to load
- Reload button for easy recovery
- Graceful fallback states to maintain user experience

## Available Scripts

- `npm start`: Runs the app in development mode
- `npm test`: Launches the test runner
- `npm run build`: Builds the app for production
- `npm run type-check`: Run TypeScript type checking
- `npm run eject`: Ejects from Create React App (one-way operation)

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Future Enhancements

- Date range picker for custom week selection
- Export functionality for chart data
- Multiple chart types (line, bar, area)
- Data filtering and search capabilities
- Mobile-responsive optimisations

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

If you encounter any issues or have questions:

1. Check the browser console for error messages
2. Use the reload button if data fails to load
3. Ensure your data source is accessible and returns the expected format
4. Open an issue in the repository for persistent problems
