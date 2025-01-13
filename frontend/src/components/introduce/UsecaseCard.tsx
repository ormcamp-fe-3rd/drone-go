interface Props{
  img: string,
  content: string
}

export default function UsecaseCard({img, content}: Props){
  return (
    <div className="justify-top flex flex-col items-center gap-8">
      <img
        src={img}
        alt={img}
        className="w-[410px] rounded-2xl shadow-lg"
      />
      <div>{content}</div>
    </div>
  );
}