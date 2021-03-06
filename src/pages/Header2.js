import React, { useEffect, useState, useRef } from 'react';
import { LockOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Layout, Avatar} from 'antd';
import './header2.css'
import { deleteUserToBoardApi, getAllUserBoard, getAllUserToAddToBoard, postUserToBoardApi } from '../Api/func/user';

function Header2(id) {
    const styleHead2 = {
        position: "relative",
        background: '#6D8DDF',
        height: '60px',
        marginTop: '6px',
        padding: '0px'
    };
    const styleButton = {
        margin: 'auto 5px',
        background: '#B9CFFB',
        color: '#fff',
        fontWeight: 'bold',
        height: '40px',
        border: 'none',
    };
    const styleAvatar = {
        width: "40px",
        height: "40px",
        color: '#000',
        textAlign: "center",
        backgroundColor: '#fff',
        fontSize: '12px',
        fontWeight: '500',
        // margin: 'auto 1px auto 0',
        borderRadius: '50%'
    };

    const invite_popup = {
        width: "300px",
        height: "400px",
        position: 'absolute',
        top: '33px',
        left: '4px',
        backgroundColor: '#ffffff',
        border: 'solid 1px #e7eaf0',
        borderRadius: '5px',
        zIndex: '1'
    }

    //state
    const [userSearch, setuserSearch] = useState([]);
    const [userAdded, setuserAdded] = useState([]);
    const [email, setemail] = useState("");
    const [error, seterror] = useState("1");
    const [users, setusers] = useState([]);//danh sach nguoi trong bang
    const [userDetail, setuserDetail] = useState({})

    //ref
    const textInput = useRef(null);

    const btnInviteOnclick = () => {
        var x = document.getElementById("invitePopup");
        document.getElementById("focus").focus();
        x.classList.toggle("isHide");
        const userDetail = document.getElementById("detail-user");
        userDetail.classList.add("isHide");
        setuserSearch([]);
        setuserAdded([]);
        seterror("1");
        textInput.current.focus();
    }

    //????ng invite
    const btnCloseInviteOnClick = () => {
        var x = document.getElementById("invitePopup");
        x.classList.add("isHide");
    }

    //change email
    const EmailOnChange = (e) => {
        if (e.target.value) {
            setemail(e.target.value);
        }
    }


    //????ng popup danh s??ch ng?????i d??ng trong b???ng - X
    const btnCloseListUser = () => {
        const dom = document.getElementById("popup-list-users");
        dom.classList.add("isHide");
    }

    //T??m Ki???m ng?????i d??ng
    const btnSearchOnClick = async (e) => {
        try {
            var users = await getAllUserToAddToBoard({
                boardId: id.id,
                keyword: email
            });

            console.log(users.data);
            if (users.data.length > 0) {
                setuserSearch(users.data);
                seterror("1");
            }
            else {
                seterror("2");
                setuserSearch([]);
            }
        } catch (ex) {
            seterror("Kh??ng t??m th???y k???t qu???");
            setuserSearch([]);
        }
    }

    //Th??m v??o danh s??ch add
    const addToListInvite = (e) => {
        if (!userAdded.includes(e)) {
            setuserAdded([...userAdded, e]);
        }
    }

    //Xo?? kh???i danh s??ch m???i v??o b???ng
    const removeToListInvite = (obj) => {
        console.log("obj Remove: ", obj)
        var arr = userAdded;
        console.log("arr: ", arr)
        for (let i = 0; i < arr.length; i++) {
            if (obj.id === arr[i].id) {
                arr.splice(i, 1);
            }
        }
        console.log("Sau khi remove: ", userAdded)
        setuserAdded([...arr]);

    }

    //th??m ng?????i v??o b???ng
    const btnAddUserOnClick = async (e) => {
        if (userAdded.length > 0) {
            for (let i = 0; i < userAdded.length; i++) {
                var u_id = userAdded[i].id;
                var b_id = id.id;
                var user_b = {
                    userId: u_id,
                    fullName: userAdded[i].fullName,
                    email: userAdded[i].email
                }
                await postUserToBoardApi({
                    userId: u_id,
                    boardId: b_id
                }).then(res => {
                    console.log("res: ", res);
                    setusers([...users, user_b])
                });
            }
            btnCloseInviteOnClick();
        }
    }

    //Hien thi danh sach nguoi dung
    const showModelDetailUser = () => {
        //An Hien danh sach
        const dom = document.getElementById("popup-list-users");
        dom.classList.toggle("isHide");

        //an chi tiet
        const domDetail = document.getElementById("detail-user");
        domDetail.classList.add("isHide");
    }

    const { Header } = Layout;
    // Get all user
    const getAllUsers = async () => {
        const users = await getAllUserBoard({
            boardId: id.id
        });
        return users;
    }

    // Chi ti???t user
    const DetailUser = (obj) => {
        //an danh sach
        const domList = document.getElementById("popup-list-users");
        domList.classList.add("isHide");
        //hien thi chi tiet
        const dom = document.getElementById("detail-user");
        dom.classList.toggle("isHide");
        //an invite
        const invite = document.getElementById("invitePopup");
        invite.classList.add("isHide")
        console.log(obj)

        setuserDetail(obj);
    }



    //????ng chi ti???t ng?????i d??ng
    const btnCloseOnClick = () => {
        const dom = document.getElementById("detail-user");
        dom.classList.add("isHide");
    }

    //X??? l?? R???i kh???i b???ng
    const btnLeaveUserOnClick = async () => {
        console.log("Chi ti???t ng???i d??ng r???i kh???i b???ng: ", userDetail)
        await deleteUserToBoardApi({
            userId: userDetail.id,
            boardId: id.id
        }).then(async () => {
            const allUsers = await getAllUsers();
            if (allUsers) {
                const dom = document.getElementById("detail-user");
                dom.classList.add("isHide");
                setusers(allUsers.data);
            }

        });
    }

    // useEffect
    useEffect(async () => {
        const getAll = async () => {
            const allUsers = await getAllUsers();
            console.log("user: ", allUsers);
            if (allUsers)
                setusers(allUsers.data);
        }
        console.log(id.id)
        getAll();
    }, []);


    return (
        <Header style={styleHead2}>
            <div style={{ margin: 'auto 20px', display: 'flex', justifyContent: 'space-between' }}>
                <div>
                    <Button style={styleButton}><LockOutlined /> Private</Button>
                    {
                        users.map((user, index) => {
                            return (index < 2) ?
                                <Button onClick={() => DetailUser(user)} key={user.id} style={styleAvatar}>{(user.fullName) ? user.fullName.charAt(0) : ""}</Button>
                                : "";
                        })
                    }

                    {/* Chi ti???t ng?????i d??ng */}
                    <div id="detail-user" className="isHide">
                        <button onClick={btnCloseOnClick} className="btnClose">X</button>
                        <div className="flex detail-user__header">
                            <div className="header__avatar">
                                <Avatar className="circle_avatar">{(userDetail.fullName) ? userDetail.fullName.charAt(0).toUpperCase() : ""}</Avatar>
                            </div>

                            <div className="infor-user">
                                <div className="infor-user_name">{userDetail.fullName}</div>
                                <div className="infor-user_email">{userDetail.email}</div>
                            </div>
                        </div>
                        {/* 3 ch??c n??ng */}
                        <div className="btn-option-user">
                            <Button className="btn">Thay ?????i quy???n</Button>
                        </div>
                        <div className="btn-option-user">
                            <Button className="btn">Xem ho???t ????ng c???a th??nh vi??n trong b???ng</Button>
                        </div>
                        <div className="btn-option-user">
                            <Button onClick={btnLeaveUserOnClick} className="btn">R???i kh???i b???ng</Button>
                        </div>

                    </div>

                    <Button onClick={showModelDetailUser} style={styleAvatar} className="btn-plus-user">
                        <PlusOutlined />{((users.length - 2) > 0) ? (users.length - 2) : ""}
                    </Button>
                    <div id="popup-list-users" className="popup-list-users isHide">
                        <button onClick={btnCloseListUser} className="btnCloseListUser">X</button>
                        <div style={{ margin: "10px 0 0 20px", lineHeight: "20px" }} >Danh s??ch ng?????i d??ng</div>
                        <hr style={{ width: "90%", margin: "10px 0 0 10px" }} />
                        {
                            users.map((user, index) => (
                                <Button onClick={() => DetailUser(user)} key={index} style={styleAvatar}>
                                    {(user.fullName) ? user.fullName.charAt(0) : ""}
                                </Button>
                            ))
                        }
                    </div>
                    {/* Button Invite */}
                    <span style={{ position: "relative" }}>
                        <Button onClick={btnInviteOnclick} style={styleButton}>
                            Invite
                        </Button>
                        <div id="invitePopup" style={invite_popup} className="isHide">
                            <button onClick={btnCloseInviteOnClick} className="btnClose" style={{ lineHeight: "normal" }}>X</button>
                            <div style={{ height: "20px", textAlign: "center", lineHeight: "20px", marginTop: "5px", alignItems: "center" }}>
                                M???i v??o b???ng
                            </div>
                            <hr style={{ width: "90%", margin: "10px 0 0 10px" }} />
                            <div>
                                <input id="focus" ref={textInput} onChange={EmailOnChange} style={{ height: "32px", marginLeft: "13px" }} type="text" placeholder="?????a ch??? email ho???c t??n" />
                                <Button style={{ marginLeft: "10px" }} onClick={btnSearchOnClick}>T??m Ki???m</Button>
                            </div>

                            <div>
                                <ul style={{ listStyleType: "none", margin: "0 0 0 20px", padding: "0", height: "110px" }}>
                                    {
                                        userSearch.map((obj, index) => (
                                            <li key={index} style={{ height: "25px", marginTop: "2px" }}>
                                                <Button style={{ height: "25px", lineHeight: "18px", border: "none", borderRadius: "10px", backgroundColor: "#6d8ddf", color: "#fff" }}
                                                    onClick={() => addToListInvite(obj)}>
                                                    {obj.email}
                                                </Button>
                                                {/* <hr/> */}
                                            </li>
                                        ))
                                    }
                                </ul>
                            </div>

                            <div style={{ textAlign: "center", fontSize: "16px" }}>{(error != "1") ? "Kh??ng t??m th???y" : ""}</div>
                            <hr style={{ width: "90%", margin: "10px 0 0 10px" }} />

                            <div>
                                <ul style={{ listStyleType: "none", margin: "0 0 0 20px", padding: "0", height: "150px"  }}>
                                    {
                                        userAdded.map((obj, index) => (
                                            <li key={index} style={{ height: "25px", marginTop: "5px" }}>
                                                <Button
                                                    style={{ height: "25px", lineHeight: "18px", border: "none", borderRadius: "10px", backgroundColor: "#b9cffb", color: "#fff" }}
                                                    onClick={() => removeToListInvite(obj)}
                                                >
                                                    {obj.email}
                                                </Button>
                                            </li>
                                        ))
                                    }
                                </ul>
                            </div>

                            <div style={{ position: "absolute", bottom: "10px", left: "25px" }}>
                                <Button onClick={btnAddUserOnClick} className="btnAddUser" style={{ width: "250px", backgroundColor: "#0079bf", color: "#fff" }}  disabled={(userAdded.length == 0)}>
                                    TH??M V??O B???NG
                                </Button>
                            </div>
                        </div>
                    </span>
                </div>
            </div>

        </Header>
    )
}

export default Header2
