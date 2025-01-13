interface Props{
  img: string;
  name: string;
  roles: string[];
}

export default function MemberCard({img, name, roles}:Props){
  const cardStyle =
    "absolute top-0 flex h-full w-full flex-col justify-center rounded-[30px] bg-gray-950 bg-opacity-20 text-white opacity-0 group-hover:opacity-100";
  return (
    <div className="group relative h-[247px] w-[247px]">
      <img src={img} alt={name} className="shadow-lg rounded-[30px]"/>
      <div className={cardStyle}>
        <p className="text-3xl font-bold">{name}</p>
        {roles.map((role, index) => (
          <p className="text-2xl font-semibold" key={index}>{role}</p>
        ))}
      </div>
    </div>
  );
}