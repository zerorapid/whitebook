const fs = require('fs');

// Patch Contacts
let contactsCode = fs.readFileSync('src/app/contacts/page.tsx', 'utf8');
contactsCode = contactsCode.replace(/import \{ contacts as initialContacts \} from '@\/lib\/data';/, "import { useStore } from '@/lib/store';");
contactsCode = contactsCode.replace(/const \[contacts, setContacts\] = useState\(initialContacts\);/, "const { contacts, addContact } = useStore();");
contactsCode = contactsCode.replace(/setContacts\(\[...contacts, newContact\]\);/g, "addContact(newContact);");
fs.writeFileSync('src/app/contacts/page.tsx', contactsCode);

// Patch Calendar
let calCode = fs.readFileSync('src/app/calendar/page.tsx', 'utf8');
calCode = calCode.replace(/import \{ events as initialEvents \} from '@\/lib\/data';/, "import { useStore } from '@/lib/store';");
calCode = calCode.replace(/const \[events, setEvents\] = useState\(initialEvents\);/, "const { events, addEvent } = useStore();");
calCode = calCode.replace(/setEvents\(\[...events, newEvent\]\);/g, "addEvent(newEvent);");
fs.writeFileSync('src/app/calendar/page.tsx', calCode);

// Patch Notifications
let notifCode = fs.readFileSync('src/app/notifications/page.tsx', 'utf8');
notifCode = notifCode.replace(/const initialNotifications[\s\S]*?\];/, "import { useStore } from '@/lib/store';");
notifCode = notifCode.replace(/const \[notifications, setNotifications\] = useState\(initialNotifications\);/, "const { notifications, markAsRead, markAllAsRead, deleteNotification } = useStore();");
notifCode = notifCode.replace(/const markAsRead =[\s\S]*?setActiveDropdown\(null\);\n  \};/, "");
notifCode = notifCode.replace(/const markAllAsRead =[\s\S]*?\}\);\n  \};/, "");
notifCode = notifCode.replace(/const deleteNotification =[\s\S]*?setActiveDropdown\(null\);\n  \};/, "");
fs.writeFileSync('src/app/notifications/page.tsx', notifCode);

