import { FiScissors, FiMinimize2, FiChevronsRight, FiRefreshCw } from 'react-icons/fi';

export const TOOL_CATEGORIES = [
  { id: 'editing', label: 'Editing & Conversion' },
];

export const FREE_TOOLS = [
  {
    id: 'compress',
    label: 'Compress',
    icon: <FiMinimize2 />,
    description: 'Reduce file size of images.',
    category: 'editing'
  },
  {
    id: 'crop',
    label: 'Crop',
    icon: <FiScissors />,
    description: 'Cut out a part of an image.',
    category: 'editing'
  },
  {
    id: 'rotate',
    label: 'Rotate & Flip',
    icon: <FiRefreshCw />,
    description: 'Rotate images by 90/180/270 degrees or flip them.',
    category: 'editing'
  },
  {
    id: 'convert',
    label: 'Convert',
    icon: <FiChevronsRight />,
    description: 'Change image format (JPG, PNG, etc).',
    category: 'editing'
  },
];

export const OUTPUT_FORMATS = [
  { id: 'original', label: 'Original Format' },
  { id: 'jpg', label: 'JPG' },
  { id: 'png', label: 'PNG' },
  { id: 'webp', label: 'WebP' },
  { id: 'pdf', label: 'PDF' }
];

export const ROTATE_OPTIONS = [
  { id: 'rotate90', label: 'Rotate 90°' },
  { id: 'rotate180', label: 'Rotate 180°' },
  { id: 'rotate270', label: 'Rotate 270°' },
  { id: 'flipH', label: 'Flip Horizontal' },
  { id: 'flipV', label: 'Flip Vertical' }
]; 