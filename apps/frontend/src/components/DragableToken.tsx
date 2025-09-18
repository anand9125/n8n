import {useDrag} from "react-dnd";
export const DragableToken = ({field}:{field:{label:string,key?:string}})=>{

    const[{isDragging}, drag] = useDrag(()=>({
        type:"TOKEN",
        item:{ text: `{{${field.key}}}` },
        collect:monitor => ({
            isDragging:monitor.isDragging(),
        })
    }))
    return (
    <div
        ref={drag}
        className={`px-2 py-1 rounded bg-blue-500 text-white cursor-move ${
            isDragging ? "opacity-50" : "opacity-100"
        }`}
       >
        {field.label}
    </div>
    );
}