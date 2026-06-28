import {Navigate} from "react-router-dom";
import {useAuth} from "../hooks/useAuth";

export default function Protected({children}:any){
    const {user,loading} = useAuth();

    if(loading) return<>Loading</>;
    if(!user) return (<Navigate to = "/login"/>);

    return children;
}