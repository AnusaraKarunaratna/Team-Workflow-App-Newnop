import {createContext, useEffect, useState} from "react";
import {getMe} from "../services/auth.service";

export const AuthContext = createContext<any>(null);

export const AuthProvider = ({childern} :any) => {
    const [ user, setUser] = useState(null);
    const [ loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async()=> {
            try{
                const res = await getMe();
                setUser(res.data);
            }catch{}

            setLoading(false);
        };
        load();
    },[]);

    return(
        <AuthContext.Provider value = {{user,setUser,loading}}>{childern}</AuthContext.Provider>
    );
};