import { createBrowserRouter } from 'react-router-dom';
import MainLayout from '@/components/MainLayout';
import PDF from '@/pages/PDF';
import PDFEditor from '@/pages/PDFEditor';
import PDFMergerSplitter from '@/pages/PDFMergerSplitter';
import PDFConverter from '@/pages/PDFConverter';
import PDFCompress from '@/pages/PDFCompress';
import NotFound from '@/pages/NotFound';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    errorElement: <NotFound />,
    children: [
      {
        path: 'pdf',
        element: <PDF />,
      },
      {
        path: 'pdf-editor',
        element: <PDFEditor />,
      },
      {
        path: 'pdf-merger',
        element: <PDFMergerSplitter />,
      },
      {        path: 'pdf-converter',
        element: <PDFConverter />,
      },
      {
        path: 'pdf/compress',
        element: <PDFCompress />,
      },
    ],
  },
]);