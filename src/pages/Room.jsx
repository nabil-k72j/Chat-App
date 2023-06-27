import { useState, useEffect } from "react"

import client, { databases, DATABASE_ID, COLLECTION_ID } from "../AppConfig"
import { ID, Query, Role, Permission } from "appwrite";

import { Trash2 } from "react-feather";

import Header from "../Components/header";
import { useAuth } from "../Utils/AuthContext";


const Room = () => {

    const { user } = useAuth()

    const [messages, setMessages] = useState([]);
    const [messageBody, setMessageBody] = useState('');

    useEffect(() => {
        getMessages()

        const unsubscribe = client.subscribe(`databases.${DATABASE_ID}.collections.${COLLECTION_ID}.documents`, response => {

            if (response.events.includes("databases.*.collections.*.documents.*.create")) {
                console.log("a message has been created")
                setMessages((prevState) => [response.payload, ...prevState]);
            }
            else if (response.events.includes("databases.*.collections.*.documents.*.delete")) {
                console.log("a message has been deleted")
                setMessages((prevState) => prevState.filter(message => message.$id !== response.payload.$id)) //delete methode for all users
            }
        });

        return () => {
            unsubscribe()
        }

    }, [])


    //Sumbit fumction
    const heandleSubmit = async (e) => {
        e.preventDefault()

        let payload = {
            user_id: user.$id,
            username: user.name,
            body: messageBody
        }

        let permissions = [
            Permission.write(Role.user(user.$id))
        ]

        let response = await databases.createDocument(
            DATABASE_ID,
            COLLECTION_ID,
            ID.unique(),
            payload,
            permissions
        )

        console.log('created', response)

        // setMessages((prevState) => [response, ...messages]);

        setMessageBody('')
    }


    //List function to get data
    const getMessages = async () => {
        const response = await databases.listDocuments(DATABASE_ID, COLLECTION_ID, [Query.orderDesc('$createdAt')])

        console.log(response);
        setMessages(response.documents)
    }


    const deleteMessage = async (message_id) => {

        databases.deleteDocument(DATABASE_ID, COLLECTION_ID, message_id)

        // setMessages((prevState) => messages.filter(message => message.$id !== message_id))
    }

    return (
        <main className="container">

            <Header />

            <div className="room--container">


                <form onSubmit={heandleSubmit} id="message--form" >

                    <div>

                        <textarea maxLength='1000'
                            placeholder="Message..."
                            required
                            onChange={(e) => { setMessageBody(e.target.value) }}
                            value={messageBody} >

                        </textarea>

                    </div>

                    <div className="send-btn--wrapper">

                        <input type="submit" value="send" className="btn btn--secondary" />

                    </div>

                </form>

                <div className="">
                    {messages.map((message) => (
                        <div key={message.$id} className="message--wrapper">

                            <div className="message--header">

                                <p>{message?.username ? (
                                    <span>{message.username}</span>
                                ) : (

                                    <span>Anonymous user</span>
                                )}

                                    <small className="message-timestamp">{new Date(message.$createdAt).toLocaleString()}</small></p>


                                {message.$permissions.includes(`delete(\"user:${user.$id}\")`) && (
                                    <Trash2 className="delete--btn" onClick={() => { deleteMessage(message.$id) }} />

                                )}
                            </div>

                            <div  className={"message--body" + (message.user_id === user.$id ? ' message--body--owner' : '')}>
                                <span>{message.body}</span>
                            </div>


                        </div>
                    ))}
                </div>

            </div>

        </main>
    )
}

export default Room