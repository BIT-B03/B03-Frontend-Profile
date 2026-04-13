// icon mapping for sidebar and toolbar
// feather icons
import {
    FiAlignLeft,
    FiAlignCenter,
    FiAlignRight,
    FiAlignJustify,
    FiBold,
    FiItalic,
    FiList,
    FiMessageSquare,
    FiCode,
    FiCornerUpLeft,
    FiCornerUpRight,
    FiHome,
    FiGrid,
    FiUsers,
    FiFolder,
    FiUser,
    FiSettings,
    FiClock,
} from 'react-icons/fi';

// remix icons
import {
    RiChatDeleteLine,
    RiFileCheckLine,
}from 'react-icons/ri';

// font awesome

import {
    FaUsersGear
} from 'react-icons/fa6';

// material design
import {
    MdOutlineFormatListNumbered,
    MdFormatStrikethrough,
    MdOutlinePersonRemove,
} from 'react-icons/md';


export const sidebarIconMap = {
    home: FiHome,
    dashboard: FiGrid,
    members: FiUsers,
    project: FiFolder,
    kickRequest: RiChatDeleteLine,
    profile: FiUser,
    settings: FiSettings,
    createKickRequest: MdOutlinePersonRemove,
    memberSettings: FaUsersGear,
    confirmPelamar: RiFileCheckLine,
};


export const getToolbarItems = (editor) => ([
    {
        label: 'H1',
        action: () => editor?.chain().focus().toggleHeading({ level: 1 }).run(),
        active: editor?.isActive('heading', { level: 1 }),
    },
    {
        label: 'H2',
        action: () => editor?.chain().focus().toggleHeading({ level: 2 }).run(),
        active: editor?.isActive('heading', { level: 2 }),
    },
    {
        label: 'Left',
        icon: FiAlignLeft,
        action: () => editor?.chain().focus().setTextAlign('left').run(),
        active: editor?.isActive({ textAlign: 'left' }),
    },
    {
        label: 'Center',
        icon: FiAlignCenter,
        action: () => editor?.chain().focus().setTextAlign('center').run(),
        active: editor?.isActive({ textAlign: 'center' }),
    },
    {
        label: 'Right',
        icon: FiAlignRight,
        action: () => editor?.chain().focus().setTextAlign('right').run(),
        active: editor?.isActive({ textAlign: 'right' }),
    },
    {
        label: 'Justify',
        icon: FiAlignJustify,
        action: () => editor?.chain().focus().setTextAlign('justify').run(),
        active: editor?.isActive({ textAlign: 'justify' }),
    },
    {
        label: 'Bold',
        icon: FiBold,
        action: () => editor?.chain().focus().toggleBold().run(),
        active: editor?.isActive('bold'),
    },
    {
        label: 'Italic',
        icon: FiItalic,
        action: () => editor?.chain().focus().toggleItalic().run(),
        active: editor?.isActive('italic'),
    },
    {
        label: 'Strike',
        icon: MdFormatStrikethrough,
        action: () => editor?.chain().focus().toggleStrike().run(),
        active: editor?.isActive('strike'),
    },
    {
        label: 'Bullet',
        icon: FiList,
        action: () => editor?.chain().focus().toggleBulletList().run(),
        active: editor?.isActive('bulletList'),
    },
    {
        label: 'Numbered',
        icon: MdOutlineFormatListNumbered,
        action: () => editor?.chain().focus().toggleOrderedList().run(),
        active: editor?.isActive('orderedList'),
    },
    {
        label: 'Quote',
        icon: FiMessageSquare,
        action: () => editor?.chain().focus().toggleBlockquote().run(),
        active: editor?.isActive('blockquote'),
    },
    {
        label: 'Code',
        icon: FiCode,
        action: () => editor?.chain().focus().toggleCodeBlock().run(),
        active: editor?.isActive('codeBlock'),
    },
    {
        label: 'Undo',
        icon: FiCornerUpLeft,
        action: () => editor?.chain().focus().undo().run(),
        active: false,
    },
    {
        label: 'Redo',
        icon: FiCornerUpRight,
        action: () => editor?.chain().focus().redo().run(),
        active: false,
    },
]);