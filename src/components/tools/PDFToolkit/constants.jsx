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
    id: 'edit-text',
    label: 'Edit Text',
    icon: <FiEdit />,
    description: 'Edit the text content directly within your PDF.'
  },
  {
    id: 'password-protect',
    label: 'Password Protect',
    icon: <FiLock />,
    description: 'Add a password to your PDF to restrict access.'
  },
  {
    id: 'unlock-pdf',
    label: 'Unlock PDF',
    icon: <FiUnlock />,
    description: 'Remove password protection from a PDF.'
  },
  {
    id: 'pdf-to-images',
    label: 'PDF to Images',
    icon: <FiImage />,
    description: 'Convert each page of a PDF into an image file.'
  },
  {
    id: 'images-to-pdf',
    label: 'Images to PDF',
    icon: <FiFile />,
    description: 'Combine multiple images into a single PDF document.'
  },
  {
    id: 'compress-pdf',
    label: 'Compress PDF',
    icon: <FiMinimize2 />,
    description: 'Reduce the file size of your PDF document.'
  },
  {
    id: 'add-watermark',
    label: 'Add Watermark',
    icon: <FiDroplet />,
    description: 'Add a text or image watermark to your PDF.'
  },
  {
    id: 'remove-pages',
    label: 'Remove Pages',
    icon: <FiDelete />,
    description: 'Delete specific pages from your PDF.'
  },
  {
    id: 'reorder-pages',
    label: 'Reorder Pages',
    icon: <FiChevronsRight />,
    description: 'Change the order of pages in your PDF.'
  }
]; 