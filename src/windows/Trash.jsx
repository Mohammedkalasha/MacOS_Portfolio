import WindowWrapper from "#hoc/WindowWrapper.jsx";
import WindowControls from "#components/WindowControls";
import useWindowStore from "#store/window.js";
import { locations } from "#constants/index.js";

const Trash = () => {
  const { openWindow } = useWindowStore();
  const { children } = locations.trash;

  const openItem = (item) => {
    if (item.fileType === "img") return openWindow("imgfile", item);
  };

  return (
    <>
      <div id="window-header">
        <WindowControls target="trash" />
        <h2>Archive</h2>
      </div>

      <div className="p-5 bg-white">
        <ul className="relative w-full h-64">
          {children.map((item) => (
            <li
              key={item.id}
              className={`absolute ${item.position} flex flex-col items-center gap-1 cursor-pointer`}
              onClick={() => openItem(item)}
            >
              <img src={item.icon} alt={item.name} className="w-12" />
              <p className="text-xs">{item.name}</p>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

const TrashWindow = WindowWrapper(Trash, "trash");

export default TrashWindow;
