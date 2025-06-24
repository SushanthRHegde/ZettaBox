import UtilityPage from '@/pages/UtilityPage';
import CurrencyConverter from '@/pages/utility/CurrencyConverter';
import UnitConverter from '@/pages/utility/UnitConverter';
import PasswordGenerator from '@/pages/utility/PasswordGenerator';
import PDFMergerSplitter from '@/pages/PDFMergerSplitter';
import { RouteObject } from 'react-router-dom';

export const utilityRoutes: RouteObject[] = [
  {
    path: '/utility',
    element: <UtilityPage />,
  },
  {
    path: '/utility/currency-converter',
    element: <CurrencyConverter />,
  },
  {
    path: '/utility/unit-converter',
    element: <UnitConverter />,
  },
  {
    path: '/utility/password-generator',
    element: <PasswordGenerator />,
  },
  {
    path: '/utility/pdf-tools',
    element: <PDFMergerSplitter />,
  },
];