export default function({title,count}: any){
    return(
        <div className="
        border
        rounded
        p-4"
        >
            <h4>{title}</h4>
            <h1>{count}</h1>
        </div>
    );
}