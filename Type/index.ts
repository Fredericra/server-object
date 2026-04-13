export interface table {
    name:string,
    title:string,
    type:'document',
    fields: Array<{
        name:string,
        title:string,
        type:string|number|boolean|object,
    }>
}

export interface User {
    _id?:string;
    username?:string;
    lastname?:string;
    firstname?:string;
    email:string;
    password:string;
    set?:{
        _id?:string;
        _createAt?:Date;
        _updateAt?:Date;
        _type?:string;
        admin:boolean;
        bio?:string;
        check:boolean;
        code:string;
        userId:{
            _ref:string;
            _type:string;
        };
        username:string;
        firstname:string;
        lastname?:string;
        verify?:boolean;
        
    },
    pro?:{
        
    }
}

export interface login {
    email:string;
    password:string;
    check?:boolean
}

export interface mail {
    from:string;
    to:string;
    subject?:string;
    text?:string;
    html:string
}


export interface UserSet {
    id_user:string;
    confirm:boolean;
    code:string;
    bio:string;
    url_profile:string;
    professional:boolean;
}

export interface resData  {
    status:boolean;
    message?:string;
    data?:User|null|string|object;
    field?:string;
    token?:string;
    verify?:boolean;
    code?:string;
}


export interface auth {
    email:string;
    id:string;
}

export interface confirm {
    confirm:string;
    other?:string;
    user?:object;
}


export interface sigin {
    username:string,
    firstname:string,
    lastname:string,
    email:string,
    password:string,
    check?:boolean,
    passwordConfirm:string,
}

export interface article {
    title: string,
    code: string,
    description: string,
    price: number,
    device: string,
    quantity: number,
    category: string,
    model: string,
    size: string,
    marque: string,
    heigth: string,
    width: string,
    length: string,
}