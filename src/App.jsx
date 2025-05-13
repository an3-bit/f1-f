import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import axios from 'axios';

import Navbar from './components/navbar/navbar';
import Footer from './components/footer/Footer';
import Home from './components/Home/Home';
import System_Advisor from './pages/System_Advisor/System_Advisor';
import System_Size from './pages/System_Sizing/System_Size';
import Quest from './pages/questionnare/Questionnare';
import Quote from './pages/Quotation/Quote';
import AuthPage from './pages/Login/login';
import ProductManual from './pages/Product_manual/product_manual';
import QuestionFlow from './pages/Question_flow/QuestionFlow';
import Testimonials from './pages/Testimonial/Testimonials';
import Test from './pages/Test/Test';
import ClientDetails from './pages/Client_details/ClientDetails';
import ClientDetailsPage from './pages/Client_details/ClientDetailsPage';

import Quote2 from './pages/Quote2/Quote2';
import ProposalTemplate from './pages/dashboard/proposal/proposaltemplate';
import Home1 from './pages/dashboard/Home1';
import Assessment from './pages/dashboard/assessment/Assessment';
import Quote1 from './pages/dashboard/quote/Quote1';
import AssessmentDashboard from './pages/dashboard/assessment/assessment_dashboard';
import ClientSelection from './pages/dashboard/assessment/ClientSelection';
import OccupancyDetails from './pages/dashboard/assessment/occupancy';
import WaterQuality from './pages/dashboard/assessment/waterquality';
import ProposalGenerationPage from './pages/dashboard/proposal/proposal';
import ReviewAssessmentPage from './pages/dashboard/assessment/ReviewAssessment';
import SolarSystemExpansionPlanner from './pages/dashboard/Future_expansion/FutureExpansion';
import GetAProposal from './pages/client_proposal/GetProposal';

const Layout = ({ children }) => {
  const location = useLocation();
  const [userType, setUserType] = useState(null);
  
  const engineerRoutes = [
    '/login',
    '/home1',
    '/assessment-dashboard',
    '/client-selection',
    '/assessment',
    '/quote1',
    '/occupancy-details',
    '/water-quality',
    '/proposal-generation',
    '/review-assessment',
    '/solar-system-expansion-planner',
    '/proposal-template'
    

  ];
  const isEngineerRoute = engineerRoutes.some(route =>
    location.pathname.startsWith(route)
  );

  const hideNavbar = isEngineerRoute || userType === 'sales_engineer';
  const hideFooter = location.pathname === '/login'|| location.pathname === '/proposal-template';

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      (async () => {
        try {
          const { data } = await axios.get('/api/user/profile');
          setUserType(data.userType);
        } catch (err) {
          console.error('Error fetching user profile:', err);
        }
      })();
    }
  }, []);

  return (
    <>
      {!hideNavbar && <Navbar />}
      <div className="flex-grow">{children}</div>
      {!hideFooter && <Footer />}
    </>
  );
};

const App = () => (
  <Router>
    <Layout>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<AuthPage />} />
        <Route path="/" element={<Home />} />
        <Route path="/system-advisor" element={<System_Advisor />} />
        <Route path="/questionnaire" element={<Quest />} />
        <Route path="/system-sizing" element={<System_Size />} />
        <Route path="/get-a-quote" element={<Quote />} />
        <Route path="/testimonials" element={<Testimonials />} />
        <Route path="/product-manual" element={<ProductManual />} />
        <Route path="/question-flow" element={<QuestionFlow />} />
        <Route path="/test" element={<Test />} />
        <Route path="/client-details" element={<ClientDetails />} />
        <Route path="/client-details-page" element={<ClientDetailsPage />} />
        <Route path="/client-proposal" element={<GetAProposal />} />
        
        <Route path="/quote2" element={<Quote2 />} />

        {/* Dashboard Routes */}
        <Route path="/home1" element={<Home1 />} />
        <Route path="/assessment-dashboard" element={<AssessmentDashboard />} />
        <Route path="/client-selection" element={<ClientSelection />} />
        <Route path="/assessment" element={<Assessment />} />
        <Route path="/assessment/occupancy" element={<Assessment />} />
        <Route path="/assessment/water-quality" element={<Assessment />} />
        <Route path="/assessment/recommendations" element={<Assessment />} />
        <Route path="/occupancy-details" element={<OccupancyDetails />} />
        <Route path="/water-quality" element={<WaterQuality />} />
        <Route path="/quote1" element={<Quote1 />} />
        <Route path="/proposal-generation" element={<ProposalGenerationPage />} />
        <Route path="/review-assessment" element={<ReviewAssessmentPage />} />
        <Route path="/solar-system-expansion-planner" element={<SolarSystemExpansionPlanner />} />
        <Route path="/proposal-template" element={<ProposalTemplate />} />
        
        {/* Catch-all Route */}

      </Routes>
    </Layout>
  </Router>
);

export default App;
