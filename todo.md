# Lojzovy Paseky AI Assistant - TODO

## Backend Implementation
- [x] Create tRPC procedure for OpenAI API communication
- [x] Integrate Czech National Bank API for CZK/EUR exchange rate
- [x] Implement rental calculation logic (rent, deposit, conversion)
- [x] Secure OpenAI API key in environment
- [x] Enhance system prompt with 7-language support (CZ, DE, EN, HR, IT, FR, ES)

## Frontend Implementation
- [x] Create FloatingChatWidget component with floating window
- [x] Extend multilingual support to 7 languages (CZ, DE, EN, HR, IT, FR, ES)
- [x] Improve language detection algorithm for all 7 languages
- [x] Responsive design for mobile devices
- [x] Color scheme: dark blue (#1a3a5f) and white
- [x] Green "REZERVOVAT TEĎ" button above chat

## Integration & Testing
- [ ] Test OpenAI API communication with real API key
- [x] Test Czech National Bank API integration (vitest)
- [x] Test rental calculation and EUR conversion (vitest)
- [ ] Test multilingual responses (E2E)
- [ ] Test responsiveness on mobile devices
- [x] Test API key security (backend only)

## Deployment
- [ ] Prepare for GitHub Pages deployment
- [ ] Create deployment documentation
- [ ] Verify functionality on production website
