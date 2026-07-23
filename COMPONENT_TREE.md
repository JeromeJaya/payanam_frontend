# Frontend Component Tree

> Generated from source code imports. Routes defined in `src/Route.jsx`.
> `(leaf)` = no internal component imports (only lucide-react, react-router-dom, hooks, or API)

---

## Entry Point

```
src/main.jsx
  └── BrowserRouter
       └── AuthProvider (src/context/AuthContext.jsx)
            └── ThemeProvider (src/context/ThemeContext.jsx)
                 └── Router (src/Route.jsx)
```

---

## Route-Level Components

Each top-level component is a route in `src/Route.jsx`.

```
/ .................................. MainPage
/login ............................ EmailLogin
/emailSignup ...................... EmailSignUp
/MainPage ......................... MainPage
/profile .......................... ProtectedRoute > UserProfile
/ExplorePlace ..................... ExplorePlace
/busbooking ....................... BusBooking
/SeatSelection .................... SeatSelection
/ForgotPassword ................... ForgotPassword
/ResetPassword .................... ResetPassword
/BookingSummary ................... BookingSummary
/flightbooking .................... FlightBooking
/flight-checkout .................. FlightCheckoutPage
/flight-seat-selection ............ FlightSeatSelection
/flight-passenger-details ......... FlightPassengerDetails
/TicketDetails .................... TicketDetails
/checkout ......................... CheckoutPage
/seatconfirmation ................. SeatConfirmation
/vendordashboard .................. VendorProtectedRoute > VendorDashboard
/VendorEmailSignUp ................ VendorEmailSignUp
/admin/login ...................... AdminLogin
/admin/signup ..................... AdminSignUp
/admin/dashboard .................. AdminProtectedRoute > AdminDashboard
/help-center ...................... HelpCenter
/contact-us ....................... ContactUs
/faqs ............................. FAQs
/terms-conditions ................. TermsConditions
/* ................................ NotFound
```

---

## Component Trees

### 1. LandingPage (not a route — standalone page)

```
src/LandingPage.jsx
  Scene3D ................................... src/components/3d/Scene3D.jsx (leaf)
  LandingHeader ............................. src/components/landing/LandingHeader.jsx (leaf)
  HeroSection ............................... src/components/landing/HeroSection.jsx (leaf)
  MarqueeTicker ............................. src/components/landing/MarqueeTicker.jsx (leaf)
  ServicesMatrix ............................ src/components/landing/ServicesMatrix.jsx (leaf)
  PipelineSection ........................... src/components/landing/PipelineSection.jsx (leaf)
  EcosystemStats ............................ src/components/landing/EcosystemStats.jsx (leaf)
  WhyChooseUs ............................... src/components/landing/WhyChooseUs.jsx (leaf)
  PopularDestinations ........................ src/components/landing/PopularDestinations.jsx (leaf)
  TestimonialsSection ........................ src/components/landing/TestimonialsSection.jsx (leaf)
  LandingFooter .............................. src/components/landing/LandingFooter.jsx (leaf)
  VendorModal ................................ src/components/landing/VendorModal.jsx (leaf)
```

### 2. MainPage (`/`, `/MainPage`)

```
src/MainPage.jsx
  NavComponent .................................. src/NavComponent.jsx
  AutoScrollContainer ........................... src/components/main/AutoScrollContainer.jsx (leaf)
  ServiceHero ................................... src/components/main/ServiceHero.jsx (leaf)
  ServiceTabs ................................... src/components/main/ServiceTabs.jsx
    Category .................................... src/components/Category.jsx (leaf)
  ServiceFeatures ............................... src/components/main/ServiceFeatures.jsx
    AutoScrollContainer .........................
  PopularRoutes ................................. src/components/main/PopularRoutes.jsx (leaf)
```

### 3. ExplorePlace (`/ExplorePlace`)

```
src/ExplorePlace.jsx
  NavComponent .................................. src/NavComponent.jsx
  SearchBar ..................................... src/search/SearchBar.jsx
    SearchInputField ............................ src/search/components/SearchInputField.jsx
      FlightPlace ............................... src/search/FlightPlace.jsx (leaf)
    SearchActionButtons ......................... src/search/components/SearchActionButtons.jsx (leaf)
    useVoiceSearch .............................. src/search/hooks/useVoiceSearch.js
    searchData .................................. src/search/data/searchData.js
  PlaceHeader ................................... src/components/explore/PlaceHeader.jsx (leaf)
  PlaceHighlights ............................... src/components/explore/PlaceHighlights.jsx (leaf)
  PlaceBookingCard .............................. src/components/explore/PlaceBookingCard.jsx (leaf)
  PlaceCategories ............................... src/components/explore/PlaceCategories.jsx (leaf)
  PlaceGallery .................................. src/components/explore/PlaceGallery.jsx (leaf)
  PlaceTips ..................................... src/components/explore/PlaceTips.jsx (leaf)
```

### 4. BusBooking (`/busbooking`)

```
src/booking/BusBooking/BusBooking.jsx
  Nav (NavComponent) ............................ src/NavComponent.jsx
  WhereToWhere .................................. src/search/WhereToWhere.jsx
    BusLocationInput ............................ src/search/components/BusLocationInput.jsx (leaf)
    BusDatePassengerInput ....................... src/search/components/BusDatePassengerInput.jsx (leaf)
    BusSearchButton ............................. src/search/components/BusSearchButton.jsx (leaf)
  MobileFilterToggle ............................ src/booking/BusBooking/components/MobileFilterToggle.jsx (leaf)
  BusFilterPanel ................................ src/booking/BusBooking/components/BusFilterPanel.jsx
    SelectBox ................................... src/filter/SelectBox.jsx (leaf)
    Checkbox .................................... src/filter/Checkbox.jsx (leaf)
    SearchheckBox ............................... src/filter/SearchheckBox.jsx (leaf)
  BusResultsList ................................ src/booking/BusBooking/components/BusResultsList.jsx
    BusFillterBar ............................... src/filter/BusFillterBar.jsx (leaf)
    BusCard ..................................... src/cards/BusCard.jsx
      SeatSelection ............................. src/booking/BusBooking/SeatSelection.jsx
      BusReviewForm ............................. src/components/BusReviewForm.jsx (leaf)
    BusLoadingState ............................. src/booking/BusBooking/components/BusLoadingState.jsx (leaf)
    BusEmptyState ............................... src/booking/BusBooking/components/BusEmptyState.jsx (leaf)
```

### 5. SeatSelection (`/SeatSelection`)

```
src/booking/BusBooking/SeatSelection.jsx
  SeatArrange ................................... src/booking/BusBooking/SeatArrange.jsx (leaf)
  Checkbox ...................................... src/filter/Checkbox.jsx (leaf)
  BookingSummary ................................ src/booking/BusBooking/BookingSummary.jsx (leaf)
```

### 6. SeatConfirmation (`/seatconfirmation`)

```
src/booking/BusBooking/SeatConfirmation.jsx
  Nav ........................................... src/NavComponent.jsx
  Loading ....................................... src/booking/BusBooking/component/Loading.jsx (leaf)
  JourneySummary ................................ src/booking/BusBooking/components/JourneySummary.jsx (leaf)
  PassengerFormList ............................. src/booking/BusBooking/components/PassengerFormList.jsx (leaf)
  PaymentSection ................................ src/booking/BusBooking/components/PaymentSection.jsx (leaf)
  PriceSummarySidebar ........................... src/booking/BusBooking/components/PriceSummarySidebar.jsx (leaf)
  useRazorpay ................................... src/hooks/useRazorpay.jsx
```

### 7. BookingSummary (`/BookingSummary`)

```
src/booking/BusBooking/BookingSummary.jsx (leaf)
```

### 8. CheckoutPage (`/checkout`)

```
src/booking/BusBooking/CheckoutPage.jsx
  CheckoutHeader ................................ src/booking/BusBooking/components/CheckoutHeader.jsx (leaf)
  CheckoutBookingSummary ........................ src/booking/BusBooking/components/CheckoutBookingSummary.jsx (leaf)
  CheckoutPassengerForm ......................... src/booking/BusBooking/components/CheckoutPassengerForm.jsx (leaf)
  CheckoutPayment ............................... src/booking/BusBooking/components/CheckoutPayment.jsx (leaf)
  useRazorpay ................................... src/hooks/useRazorpay.jsx
```

### 9. TicketDetails (`/TicketDetails`)

```
src/booking/BusBooking/TicketDetails.jsx
  Nav ........................................... src/NavComponent.jsx
  TicketInfoCard ................................ src/booking/BusBooking/components/TicketInfoCard.jsx (leaf)
  TicketPassengerList ........................... src/booking/BusBooking/components/TicketPassengerList.jsx (leaf)
  TicketPaymentDetails .......................... src/booking/BusBooking/components/TicketPaymentDetails.jsx (leaf)
  TicketActionsBar .............................. src/booking/BusBooking/components/TicketActionsBar.jsx (leaf)
```

### 10. FlightBooking (`/flightbooking`)

```
src/booking/FlightBooking/FlightBooking.jsx
  Nav ........................................... src/NavComponent.jsx
  WhereToWhere .................................. src/booking/FlightBooking/Wheretowhere.jsx
    LocationInput ............................... src/booking/FlightBooking/components/LocationInput.jsx
      AirportSuggestions ........................ src/booking/FlightBooking/components/AirportSuggestions.jsx (leaf)
    SwapButton .................................. src/booking/FlightBooking/components/SwapButton.jsx (leaf)
    DateInput ................................... src/booking/FlightBooking/components/DateInput.jsx (leaf)
    SearchButton ................................ src/booking/FlightBooking/components/SearchButton.jsx (leaf)
  SelectedFlightsSidebar ........................ src/cards/SelectedFlightsSidebar.jsx
    FlightPriceModal ............................ src/booking/FlightBooking/FlightPriceModal.jsx (leaf)
    CompareHeader ............................... src/cards/components/CompareHeader.jsx (leaf)
    CompareFlightList ........................... src/cards/components/CompareFlightList.jsx (leaf)
    CompareDetails .............................. src/cards/components/CompareDetails.jsx (leaf)
  FlightFilterPanel ............................. src/booking/FlightBooking/components/FlightFilterPanel.jsx
    SearchheckBox ............................... src/filter/SearchheckBox.jsx (leaf)
    SelectBox ................................... src/filter/SelectBox.jsx (leaf)
  FlightResultsList ............................. src/booking/FlightBooking/components/FlightResultsList.jsx
    FlightCard .................................. src/cards/FlightCard.jsx
      FlightPriceModal .......................... src/booking/FlightBooking/FlightPriceModal.jsx (leaf)
      PriceLockModal ............................ src/booking/FlightBooking/PriceLockModal.jsx
        PriceLockHeader ......................... src/booking/FlightBooking/components/PriceLockHeader.jsx (leaf)
        PriceLockForm ........................... src/booking/FlightBooking/components/PriceLockForm.jsx (leaf)
        PriceLockBenefits ....................... src/booking/FlightBooking/components/PriceLockBenefits.jsx (leaf)
      FlightCardHeader .......................... src/cards/components/FlightCardHeader.jsx (leaf)
      FlightJourneyDetails ...................... src/cards/components/FlightJourneyDetails.jsx (leaf)
      FlightFareSection ......................... src/cards/components/FlightFareSection.jsx (leaf)
      FlightCompareButton ....................... src/cards/components/FlightCompareButton.jsx (leaf)
    FlightFareSelector .......................... src/booking/FlightBooking/FlightFareSelector.jsx (leaf)
    FlightLoadingState .......................... src/booking/FlightBooking/components/FlightLoadingState.jsx (leaf)
    FlightEmptyState ............................ src/booking/FlightBooking/components/FlightEmptyState.jsx (leaf)
  MobileFilterButton ............................ src/booking/FlightBooking/components/MobileFilterButton.jsx (leaf)
```

### 11. FlightCheckoutPage (`/flight-checkout`)

```
src/booking/FlightBooking/FlightCheckoutPage.jsx
  Nav ........................................... src/NavComponent.jsx
  FlightTimeline ................................ src/components/flightComponents/FlightTimeline.jsx (leaf)
  BaggageInfo ................................... src/components/flightComponents/BaggageInfo.jsx (leaf)
  CouponsOffers ................................. src/components/flightComponents/CouponsOffers.jsx (leaf)
  CancellationPolicy ............................ src/components/flightComponents/CancellationPolicy.jsx (leaf)
  ImportantInfo ................................. src/components/flightComponents/ImportantInfo.jsx (leaf)
  TravellerDetails .............................. src/components/flightComponents/TravellerDetails.jsx
    ContactForm ................................. src/components/flightComponents/ContactForm.jsx (leaf)
    PassengerCard ............................... src/components/flightComponents/PassengerCard.jsx (leaf)
  CheckoutHeader ................................ src/booking/FlightBooking/components/CheckoutHeader.jsx (leaf)
  PriceLockBanner ............................... src/booking/FlightBooking/components/PriceLockBanner.jsx (leaf)
  SelectedMealsSummary .......................... src/booking/FlightBooking/components/SelectedMealsSummary.jsx (leaf)
  PaymentSection ................................ src/booking/FlightBooking/components/PaymentSection.jsx (leaf)
  PriceSummary .................................. src/booking/FlightBooking/components/PriceSummary.jsx (leaf)
  useRazorpay ................................... src/hooks/useRazorpay.jsx
```

### 12. FlightSeatSelection (`/flight-seat-selection`)

```
src/booking/FlightBooking/FlightSeatSelection.jsx
  Nav ........................................... src/NavComponent.jsx
  FlightSeatHeader .............................. src/booking/FlightBooking/components/FlightSeatHeader.jsx (leaf)
  SeatMap ....................................... src/booking/FlightBooking/components/SeatMap.jsx (leaf)
  MealSelection ................................. src/booking/FlightBooking/components/MealSelection.jsx
    MEAL_MENU ................................... src/booking/FlightBooking/data/mealMenu.js
  SelectionSummary .............................. src/booking/FlightBooking/components/SelectionSummary.jsx (leaf)
```

### 13. FlightPassengerDetails (`/flight-passenger-details`)

```
src/booking/FlightBooking/FlightPassengerDetails.jsx
  Nav ........................................... src/NavComponent.jsx
  PassengerForm ................................. src/booking/FlightBooking/components/PassengerForm.jsx (leaf)
```

### 14. UserProfile (`/profile`)

```
src/UserProfile.jsx
  Nav ........................................... src/NavComponent.jsx
  ProfileHeader ................................. src/components/profile/ProfileHeader.jsx (leaf)
  NotificationBanner ............................ src/components/profile/NotificationBanner.jsx (leaf)
  ProfileSidebar ................................ src/components/profile/ProfileSidebar.jsx (leaf)
  PersonalInfoForm .............................. src/components/profile/PersonalInfoForm.jsx (leaf)
  BillingInfo ................................... src/components/profile/BillingInfo.jsx (leaf)
  BookingsHistory ............................... src/components/profile/BookingsHistory.jsx
    BookingCard ................................. src/components/profile/BookingCard.jsx (leaf)
  ReviewModal ................................... src/components/profile/ReviewModal.jsx (leaf)
```

### 15. VendorDashboard (`/vendordashboard`)

```
src/VendorDashboard.jsx
  Header ........................................ src/vendor/VendorHeader.jsx (leaf)
  DashboardSearch ............................... src/vendor/DashboardSearch.jsx
    VendorSearch ................................ src/vendor/VendorSearch.jsx (leaf)
  DashboardSkeleton ............................. src/vendor/DashboardSkeleton.jsx (leaf)
  DashboardStatsGrid ............................ src/vendor/DashboardStatsGrid.jsx (leaf)
  ScheduleCategorySelector ...................... src/vendor/ScheduleCategorySelector.jsx
    SERVICE_CATEGORIES .......................... src/vendor/VendorServiceCategoryGrid.jsx (leaf)
  VendorOverview ................................ src/vendor/VendorOverview.jsx (leaf)
  VendorBookings ................................ src/vendor/VendorBookings.jsx (leaf)
  VendorRoutes .................................. src/vendor/VendorRoutes.jsx (leaf)
  VendorAnalytics ............................... src/vendor/VendorAnalytics.jsx (leaf)
  VendorBusServiceView .......................... src/vendor/VendorBusServiceView.jsx (leaf)
  VendorFlightServiceView ....................... src/vendor/VendorFlightServiceView.jsx (leaf)
  VendorBusSchedule ............................. src/vendor/VendorBusSchedule.jsx
    ScheduleList ................................ src/vendor/components/ScheduleList.jsx (leaf)
    ScheduleForm ................................ src/vendor/components/ScheduleForm.jsx (leaf)
    ScheduleBoardingPoints ...................... src/vendor/components/ScheduleBoardingPoints.jsx (leaf)
    ScheduleActions ............................. src/vendor/components/ScheduleActions.jsx (leaf)
  VendorFlightSchedule .......................... src/vendor/VendorFlightSchedule.jsx (leaf)
  VendorDeleteModals ............................ src/vendor/VendorDeleteModals.jsx (leaf)
  VendorCancelScheduleModals .................... src/vendor/VendorCancelScheduleModals.jsx (leaf)
  VendorBookingDetailModal ...................... src/vendor/VendorBookingDetailModal.jsx (leaf)
  ViewFlightRoutesModal ......................... src/vendor/ViewFlightRoutesModal.jsx (leaf)
  FlightRouteFormModal .......................... src/vendor/FlightRouteFormModal.jsx (leaf)
  FlightScheduleFormModal ....................... src/vendor/FlightScheduleFormModal.jsx (leaf)
```

### 16. AdminDashboard (`/admin/dashboard`)

```
src/admin/AdminDashboard.jsx
  AdminChatbot .................................. src/admin/AdminChatbot.jsx (leaf)
  AdminUsers .................................... src/admin/AdminUsers.jsx (leaf)
  AdminSidebar .................................. src/admin/components/AdminSidebar.jsx (leaf)
  AdminHeader ................................... src/admin/components/AdminHeader.jsx (leaf)
  AdminOverview ................................. src/admin/components/AdminOverview.jsx
    UserOverview ................................ src/admin/components/UserOverview.jsx (leaf)
    RevenueStats ................................ src/admin/components/RevenueStats.jsx (leaf)
    BookingsStats ............................... src/admin/components/BookingsStats.jsx (leaf)
    FleetStats .................................. src/admin/components/FleetStats.jsx (leaf)
  Pagination .................................... src/admin/components/Pagination.jsx (leaf)
  vendorUtils ................................... src/admin/components/vendorUtils.jsx (leaf)
  AdminBuses .................................... src/admin/components/AdminBuses.jsx (leaf)
  AdminFlights .................................. src/admin/components/AdminFlights.jsx (leaf)
  AdminBookings ................................. src/admin/components/AdminBookings.jsx (leaf)
```

### 17. AdminAuth Pages

```
src/admin/AdminLogin.jsx
  But3 .......................................... src/Buttons/But3.jsx (leaf)
  Nav (NavComponent) ............................ src/NavComponent.jsx
  PasswordInput ................................. src/Authentication/PasswordInput.jsx (leaf)

src/admin/AdminSignUp.jsx
  But3 .......................................... src/Buttons/But3.jsx (leaf)
  Nav (NavComponent) ............................ src/NavComponent.jsx
  PasswordInput ................................. src/Authentication/PasswordInput.jsx (leaf)
```

### 18. Auth Pages

```
src/Authentication/EmailLogin.jsx
  But3 .......................................... src/Buttons/But3.jsx (leaf)
  But ........................................... src/Buttons/But.jsx (leaf)
  Nav (NavComponent) ............................ src/NavComponent.jsx
  PasswordInput ................................. src/Authentication/PasswordInput.jsx (leaf)

src/Authentication/EmailSignUp.jsx
  But3 .......................................... src/Buttons/But3.jsx (leaf)
  Nav (NavComponent) ............................ src/NavComponent.jsx
  PasswordInput ................................. src/Authentication/PasswordInput.jsx (leaf)

src/Authentication/ForgotPassword.jsx
  But3 .......................................... src/Buttons/But3.jsx (leaf)
  Nav (NavComponent) ............................ src/NavComponent.jsx

src/Authentication/ResetPassword.jsx
  But3 .......................................... src/Buttons/But3.jsx (leaf)
  Nav (NavComponent) ............................ src/NavComponent.jsx
  PasswordInput ................................. src/Authentication/PasswordInput.jsx (leaf)

src/Authentication/MobileLogin.jsx
  But ........................................... src/Buttons/But.jsx (leaf)
  But2 .......................................... src/Buttons/But2.jsx (leaf)
  Nav (NavComponent) ............................ src/NavComponent.jsx
  EmailLogin .................................... src/Authentication/EmailLogin.jsx

src/Authentication/vendor/VendorEmailSignUp.jsx
  But3 .......................................... src/Buttons/But3.jsx (leaf)
  Nav (NavComponent) ............................ src/NavComponent.jsx
  PasswordInput ................................. src/Authentication/PasswordInput.jsx (leaf)
```

### 19. Static Pages

```
src/ContactUs.jsx
  Nav (NavComponent) ............................ src/NavComponent.jsx

src/HelpCenter.jsx (leaf)
src/FAQs.jsx (leaf)
src/TermsConditions.jsx (leaf)
src/components/NotFound.jsx (leaf)
```

### 20. Modal / Form Components (not routes)

```
src/components/BusDetailModal.jsx
  BusDetailHeader ............................... src/components/busDetails/BusDetailHeader.jsx (leaf)
  BusInfoSection ................................ src/components/busDetails/BusInfoSection.jsx (leaf)
  BusAmenitiesSection ........................... src/components/busDetails/BusAmenitiesSection.jsx (leaf)
  BusReviewSection .............................. src/components/busDetails/BusReviewSection.jsx (leaf)

src/components/FlightDetailModal.jsx (leaf)
src/components/BusReviewForm.jsx (leaf)
src/components/EditBusForm.jsx (leaf)

src/components/CreateBusForm.jsx
  BusBasicInfo .................................. src/components/busForms/BusBasicInfo.jsx (leaf)
  BusConfiguration .............................. src/components/busForms/BusConfiguration.jsx (leaf)
  BusAmenities .................................. src/components/busForms/BusAmenities.jsx (leaf)
  SeatLayoutConfig .............................. src/components/busForms/SeatLayoutConfig.jsx (leaf)
  SeatEditorModal ............................... src/components/busForms/SeatEditorModal.jsx (leaf)

src/components/CreateFlightForm.jsx
  FlightBasicInfo ............................... src/components/flightForms/FlightBasicInfo.jsx (leaf)
  FlightCabinConfig ............................. src/components/flightForms/FlightCabinConfig.jsx (leaf)
  FlightAmenities ............................... src/components/flightForms/FlightAmenities.jsx (leaf)
  FlightSeatPreview ............................. src/components/flightForms/FlightSeatPreview.jsx (leaf)

src/components/CreateRouteForm.jsx
  RouteHeader ................................... src/components/routeForms/RouteHeader.jsx (leaf)
  BusSelector ................................... src/components/routeForms/BusSelector.jsx (leaf)
  RouteEndpoints ................................ src/components/routeForms/RouteEndpoints.jsx
    CitySuggestions ............................. src/components/routeForms/CitySuggestions.jsx (leaf)
  IntermediateStops ............................. src/components/routeForms/IntermediateStops.jsx (leaf)
  RouteMetrics .................................. src/components/routeForms/RouteMetrics.jsx (leaf)
  FormActions ................................... src/components/routeForms/FormActions.jsx (leaf)
```

### 21. Flight Booking Modals

```
src/booking/FlightBooking/BookingSummary.jsx (leaf)
src/booking/FlightBooking/FlightFareSelector.jsx (leaf)
src/booking/FlightBooking/FlightPriceModal.jsx (leaf)
src/booking/FlightBooking/BookingSuccess.jsx (leaf)
src/booking/FlightBooking/SeatArrange.jsx (leaf)

src/booking/FlightBooking/PriceLockModal.jsx
  PriceLockHeader ............................... src/booking/FlightBooking/components/PriceLockHeader.jsx (leaf)
  PriceLockForm ................................. src/booking/FlightBooking/components/PriceLockForm.jsx (leaf)
  PriceLockBenefits ............................. src/booking/FlightBooking/components/PriceLockBenefits.jsx (leaf)
```

### 22. FlightBooking Shared Components (`src/booking/FlightBooking/components/`)

```
CheckoutHeader ............... src/booking/FlightBooking/components/CheckoutHeader.jsx (leaf)
PriceLockBanner .............. src/booking/FlightBooking/components/PriceLockBanner.jsx (leaf)
SelectedMealsSummary ......... src/booking/FlightBooking/components/SelectedMealsSummary.jsx (leaf)
PaymentSection ............... src/booking/FlightBooking/components/PaymentSection.jsx (leaf)
PriceSummary ................. src/booking/FlightBooking/components/PriceSummary.jsx (leaf)
FlightSeatHeader ............. src/booking/FlightBooking/components/FlightSeatHeader.jsx (leaf)
SeatMap ...................... src/booking/FlightBooking/components/SeatMap.jsx (leaf)
MealSelection ................ src/booking/FlightBooking/components/MealSelection.jsx (leaf)
SelectionSummary ............. src/booking/FlightBooking/components/SelectionSummary.jsx (leaf)
FlightFilterPanel ............ src/booking/FlightBooking/components/FlightFilterPanel.jsx (leaf)
FlightResultsList ............ src/booking/FlightBooking/components/FlightResultsList.jsx (leaf)
MobileFilterButton ........... src/booking/FlightBooking/components/MobileFilterButton.jsx (leaf)
FlightLoadingState ........... src/booking/FlightBooking/components/FlightLoadingState.jsx (leaf)
FlightEmptyState ............. src/booking/FlightBooking/components/FlightEmptyState.jsx (leaf)
LocationInput ................ src/booking/FlightBooking/components/LocationInput.jsx (leaf)
AirportSuggestions ........... src/booking/FlightBooking/components/AirportSuggestions.jsx (leaf)
SwapButton ................... src/booking/FlightBooking/components/SwapButton.jsx (leaf)
DateInput .................... src/booking/FlightBooking/components/DateInput.jsx (leaf)
SearchButton ................. src/booking/FlightBooking/components/SearchButton.jsx (leaf)
PassengerClassDropdown ....... src/booking/FlightBooking/components/PassengerClassDropdown.jsx (leaf)
PassengerForm ................ src/booking/FlightBooking/components/PassengerForm.jsx (leaf)
ContactInfoForm .............. src/booking/FlightBooking/components/ContactInfoForm.jsx (leaf)
TravellerDetails ............. src/booking/FlightBooking/components/TravellerDetails.jsx (leaf)
FlightTimeline ............... src/booking/FlightBooking/components/FlightTimeline.jsx (leaf)
BaggageInfo .................. src/booking/FlightBooking/components/BaggageInfo.jsx (leaf)
CouponsOffers ................ src/booking/FlightBooking/components/CouponsOffers.jsx (leaf)
CancellationPolicy ........... src/booking/FlightBooking/components/CancellationPolicy.jsx (leaf)
ImportantInfo ................ src/booking/FlightBooking/components/ImportantInfo.jsx (leaf)
PriceLockHeader .............. src/booking/FlightBooking/components/PriceLockHeader.jsx (leaf)
PriceLockForm ................ src/booking/FlightBooking/components/PriceLockForm.jsx (leaf)
PriceLockBenefits ............ src/booking/FlightBooking/components/PriceLockBenefits.jsx (leaf)
FlightBookingDetails ......... src/booking/FlightBooking/components/FlightBookingDetails.jsx (leaf)
```

### 23. Flight Components (shared, `src/components/flightComponents/`)

```
FlightTimeline ............... src/components/flightComponents/FlightTimeline.jsx (leaf)
BaggageInfo .................. src/components/flightComponents/BaggageInfo.jsx (leaf)
CouponsOffers ................ src/components/flightComponents/CouponsOffers.jsx (leaf)
CancellationPolicy ........... src/components/flightComponents/CancellationPolicy.jsx (leaf)
ImportantInfo ................ src/components/flightComponents/ImportantInfo.jsx (leaf)
TravellerDetails ............. src/components/flightComponents/TravellerDetails.jsx
  ContactForm ................. src/components/flightComponents/ContactForm.jsx (leaf)
  PassengerCard ............... src/components/flightComponents/PassengerCard.jsx (leaf)
FlightBookingDetails ......... src/components/flightComponents/FlightBookingDetails.jsx (leaf)
```

### 24. Cards

```
src/cards/BusCard.jsx
  SeatSelection ............... src/booking/BusBooking/SeatSelection.jsx
  BusReviewForm ............... src/components/BusReviewForm.jsx (leaf)

src/cards/FlightCard.jsx
  FlightPriceModal ............ src/booking/FlightBooking/FlightPriceModal.jsx (leaf)
  PriceLockModal .............. src/booking/FlightBooking/PriceLockModal.jsx
  FlightCardHeader ............ src/cards/components/FlightCardHeader.jsx (leaf)
  FlightJourneyDetails ........ src/cards/components/FlightJourneyDetails.jsx (leaf)
  FlightFareSection ........... src/cards/components/FlightFareSection.jsx (leaf)
  FlightCompareButton ......... src/cards/components/FlightCompareButton.jsx (leaf)

src/cards/SelectedFlightsSidebar.jsx
  FlightPriceModal ............ src/booking/FlightBooking/FlightPriceModal.jsx (leaf)
  CompareHeader ............... src/cards/components/CompareHeader.jsx (leaf)
  CompareFlightList ........... src/cards/components/CompareFlightList.jsx (leaf)
  CompareDetails .............. src/cards/components/CompareDetails.jsx (leaf)

src/cards/HotelCard.jsx (leaf)
src/cards/TrainCard.jsx (leaf)
src/cards/SearchCard.jsx (leaf)
src/cards/Banner.jsx (leaf)
src/cards/FlightDetailsModal.jsx (leaf)
```

### 25. Other Components

```
src/NavComponent.jsx ............................ (uses AuthContext, ThemeContext)
src/SelectService.jsx ........................... Banner
src/G.jsx ....................................... (Framer Motion experiment — leaf)
src/Carousels/Offers.jsx ........................ (leaf)
src/components/ProtectedRoute.jsx ............... (route guard wrapper)
src/components/PasswordInput.jsx ................ (leaf)
```

### 26. Filter Components

```
src/filter/Checkbox.jsx (leaf)
src/filter/SelectBox.jsx (leaf)
src/filter/SearchheckBox.jsx (leaf)
src/filter/BusFillterBar.jsx (leaf)
```

### 27. Buttons

```
src/Buttons/But.jsx (leaf)
src/Buttons/But2.jsx (leaf)
src/Buttons/But3.jsx (leaf)
```

### 28. Search

```
src/search/SearchBar.jsx
  SearchInputField ............... src/search/components/SearchInputField.jsx
    FlightPlace .................. src/search/FlightPlace.jsx (leaf)
  SearchActionButtons ............ src/search/components/SearchActionButtons.jsx (leaf)
  useVoiceSearch ................. src/search/hooks/useVoiceSearch.js

src/search/WhereToWhere.jsx
  BusLocationInput ............... src/search/components/BusLocationInput.jsx (leaf)
  BusDatePassengerInput .......... src/search/components/BusDatePassengerInput.jsx (leaf)
  BusSearchButton ................ src/search/components/BusSearchButton.jsx (leaf)

src/search/FlightPlace.jsx (leaf)
src/search/data/searchData.js
src/search/hooks/useVoiceSearch.js
```

### 29. Contexts & Hooks

```
src/context/AuthContext.jsx .................... (provides useAuth)
src/context/ThemeContext.jsx ................... (provides useTheme)
src/hooks/useRazorpay.jsx ...................... (Razorpay integration)
src/hooks/useScrollAnimation.jsx ............... (scroll animation)
```

### 30. API & Data

```
src/api/axios.js ............................... (Axios instance)
src/booking/places.json ........................ (static data)
```

---

## Empty Directories

```
src/pages/         — empty
src/utils/         — empty
src/booking/HotelBooking/ — no JSX files (route exists but unimplemented)
```

---

## File Count Summary

| Category | Count |
|---|---|
| Route-level components | ~22 |
| Bus booking components | ~25 |
| Flight booking components | ~35 |
| Vendor components | ~25 |
| Admin components | ~15 |
| Card components | ~20 |
| Auth components | ~10 |
| Shared/form components | ~30 |
| Search components | ~10 |
| Static page components | ~5 |
| Contexts, hooks, API | ~5 |
| **Total (approx)** | **~150+** |
