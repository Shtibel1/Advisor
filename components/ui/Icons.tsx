import {
  MdMenu,
  MdClose,
  MdSchedule,
  MdBarChart,
  MdChat,
  MdStorage,
  MdSmartToy,
  MdTrendingUp,
  MdSecurity,
  MdCode,
  MdPeople,
  MdCheck,
} from 'react-icons/md'
import { FaLinkedin } from 'react-icons/fa'

export const MenuIcon     = () => <MdMenu      size={24} />
export const XIcon        = () => <MdClose     size={24} />
export const ClockIcon    = () => <MdSchedule  size={22} />
export const BarChartIcon = () => <MdBarChart  size={22} />
export const MessageIcon  = () => <MdChat      size={22} />
export const DatabaseIcon = () => <MdStorage   size={24} />
export const BotIcon      = () => <MdSmartToy  size={24} />
export const TrendingUpIcon = () => <MdTrendingUp size={24} />
export const ShieldIcon   = () => <MdSecurity  size={20} />
export const CodeIcon     = () => <MdCode      size={20} />
export const UsersIcon    = () => <MdPeople    size={20} />
export const CheckIcon    = () => <MdCheck     size={32} />
export const LinkedInIcon = () => <FaLinkedin  size={18} />
