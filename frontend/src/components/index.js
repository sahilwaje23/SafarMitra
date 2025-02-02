// first import all pages here and then export all of them. 
import CaptainSignUp from './driver/CaptainSignUp'
import CaptainSignIn from './driver/CaptainSignIn'
import Landing from './landing/Landing'
import UserSignIn from './user/UserSignIn'
import UserSignUp from './user/UserSignUp'
import UserHomePage from './user/UserHomePage'
import CaptainHomePage from './driver/CaptainHomePage'
import Navbar from './navbar/Navbar';
import RoomInt from './room/Room-int';
import UserProfile from './user/UserProfile';
import { DriverCard , ParticipantCard , JourneyCard} from './user/DataForRoomInt'

export {Landing,CaptainSignUp,CaptainSignIn,UserSignIn,UserSignUp,UserHomePage,CaptainHomePage,Navbar,RoomInt,UserProfile,DriverCard,ParticipantCard,JourneyCard}; 