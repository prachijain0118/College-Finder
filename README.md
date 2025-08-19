

### Prerequisites

- Node.js (version 16 or higher)
- npm 

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd college-finder-india
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
# Copy the example environment file
cp .env.example .env

# Edit .env and add your Gemini API key
VITE_GEMINI_API_KEY=your_actual_gemini_api_key_here
```

4. Start the development server:
```bash
npm run dev
```

5. Open your browser and navigate to `http://localhost:5173`

## 🔑 Getting a Gemini API Key

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Create a new API key
4. Copy the API key and add it to your `.env` file

## 🛠️ Technologies Used

- **React 18**: Modern React with hooks
- **TypeScript**: Type-safe development
- **Vite**: Fast build tool and development server
- **Google Gemini AI**: AI-powered college data retrieval
- **CSS3**: Modern styling with flexbox and grid

## 📱 How to Use

1. **Select Search Type**: Choose between searching by state or city
2. **Choose Location**: Either select from the dropdown or enter a custom location
3. **Search**: Click the "Find Colleges" button
4. **View Results**: Browse through the college listings with detailed information
5. **Contact Colleges**: Use the provided contact information to reach out directly

## 🏗️ Project Structure

```
src/
├── components/
│   ├── LocationSelector.tsx    # Location input and selection
│   └── CollegeResults.tsx      # Display search results
├── services/
│   └── geminiService.ts        # Gemini AI integration
├── App.tsx                     # Main application component
├── main.tsx                    # Application entry point
├── App.css                     # Application styles
└── style.css                   # Global styles
```

## 🎯 Features in Detail

### Location Selection
- Dropdown menus with all Indian states and major cities
- Custom location input for specific areas
- Toggle between state and city search modes

### College Information
Each college result includes:
- **Basic Info**: Name, address, type (IT/Management/Both)
- **Contact Details**: Phone, email, website links
- **Courses**: List of available programs
- **Fees**: Detailed fee structure for different courses

### AI Integration
- Uses Google Gemini AI to search for college information
- Intelligent parsing of location-based queries
- Fallback to mock data if AI service is unavailable

## 🚀 Build and Deploy

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🆘 Support

If you encounter any issues or have questions, please open an issue on the GitHub repository.
