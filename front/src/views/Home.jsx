import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../contexts/auth";
import { Link, useNavigate, useParams } from "react-router-dom";
import Loading from "../components/Loading";
import axios from "../axios";
export default function Home() {
    const auth = useContext(AuthContext);
    const navigate = useNavigate();


    const [users, setUsers] = useState({});
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        axios.get("/api/user").then((response) => {
            setUsers({
                name: "rateb",
                name: "email",
            });
            setIsLoading(false);
        });
    }, []);

    return (
        <>
            {isLoading ? (
                <Loading centered={false} size={7} /> //not loading
            ) : (
                <>
                    <h1>home {auth.user?.name}</h1>
                </>
            )}
        </>
    );
}
