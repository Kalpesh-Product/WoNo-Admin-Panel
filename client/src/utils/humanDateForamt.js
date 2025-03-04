const humanDate = (date) =>{
    return new Intl.DateTimeFormat("en-GB",{day:"2-digit",month:'short',year:'numeric'}).format(new Date(date))
}

export default humanDate