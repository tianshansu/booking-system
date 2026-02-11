export default function Card(props){
    return(
        <div style={{display:"grid", border:"1px solid #E5E7EB", padding:"30px", backgroundColor:"white"}}>
            <div>{props.title}</div>
            <div style={{fontSize:"30px", fontWeight:"600"}}>{props.count}</div>
            <div style={{fontSize:"12px"}}>{props.comment}</div>
        </div>
    )
}