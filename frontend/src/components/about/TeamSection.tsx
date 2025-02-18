import MemberCard from "./MemberCard";

export default function TeamSection() {
  return (
    <div className="flex w-full max-w-[1440px] flex-col items-center justify-center gap-10 pb-40 text-center">
      <div className="title">Meet Our Teem</div>
      <div className="subtitle">
        We are a team full of warm smiles and positive energy. <br />
        Coming from diverse backgrounds, we come together as one, supporting
        each other and growing together.
      </div>
      <div className="grid grid-cols-1 gap-14 sm:grid-cols-2 lg:grid-cols-4">
        <MemberCard
          img={"/images/introduce/section03-01.png"}
          name={"BanJaeYeong"}
          roles={["TeamLeader", "Frontend"]}
        />
        <MemberCard
          img={"/images/introduce/section03-02.png"}
          name={"KimDoYeon"}
          roles={["Frontend"]}
        />
        <MemberCard
          img={"/images/introduce/section03-03.png"}
          name={"KimSuJin"}
          roles={["Frontend"]}
        />
        <MemberCard
          img={"/images/introduce/section03-04.png"}
          name={"KimHyeBin"}
          roles={["Frontend", "Designer"]}
        />
      </div>
    </div>
  );
}
