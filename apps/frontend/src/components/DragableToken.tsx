import {useDrag} from "react-dnd";
const getColorClass = (key?: string) => {
  const colors = [
    "bg-blue-100 text-blue-700 border-blue-300",
    "bg-green-100 text-green-700 border-green-300",
    "bg-purple-100 text-purple-700 border-purple-300",
    "bg-pink-100 text-pink-700 border-pink-300",
    "bg-yellow-100 text-yellow-700 border-yellow-300",
    "bg-orange-100 text-orange-700 border-orange-300",
  ];

  // pick based on string hash
  const str = key ?? "";
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % colors.length;
  return colors[index];
};

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
      key={field.key ?? field.label}
      className={`px-3 py-1.5 rounded-lg border text-xs font-medium cursor-move select-none shadow-sm transition
        ${isDragging 
          ? "opacity-50 scale-95" 
          : "opacity-100 hover:shadow-md hover:scale-105"
        }
        ${getColorClass(field.key ?? field.label)}
      `}
    >
      {field.label}
    </div>

    );
}