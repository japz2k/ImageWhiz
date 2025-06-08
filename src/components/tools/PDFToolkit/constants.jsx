import {
  FiGitMerge, FiScissors, FiEdit, FiLock, FiUnlock, FiImage, FiFile,
  FiMinimize2, FiDroplet, FiDelete, FiChevronsRight
} from 'react-icons/fi';

export const PDF_TOOLS = [
  {
    id: 'merge-pdf',
    label: 'Merge PDFs',
    icon: <FiGitMerge />,
    description: 'Combine multiple PDF files into one.'
  },
  {
    id: 'split-pdf',
    label: 'Split PDF',
    icon: <FiScissors />,
    description: 'Extract pages from a PDF into a new document.'
  },

  {
    id: 'pdf-to-images',
    label: 'PDF to Images',
    icon: <FiImage />,
    description: 'Convert each page of a PDF into an image file.'
  },
  {
    id: 'compress-pdf',
    label: 'Compress PDF',
    icon: <FiMinimize2 />,
    description: 'Reduce the file size of your PDF document.'
  },

  {
    id: 'remove-pages',
    label: 'Remove Pages',
    icon: <FiDelete />,
    description: 'Delete specific pages from your PDF.'
  }
]; 