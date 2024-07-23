import {useContext} from "react";
import { MainSocketContext } from "./provider";



export const useMainSocket = () => {
	return useContext(MainSocketContext);
};
