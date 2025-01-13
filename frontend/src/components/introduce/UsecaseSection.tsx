export default function UsecaseSection(){
  return (
    <div className="flex w-full max-w-[1440px] flex-col items-center justify-center gap-10 text-center">
      <div className="title">
        Elevate Your Drone Operations with Our Platform
      </div>
      <div className="subtitle">
        Effortlessly manage, analyze, and visualize your drone flight data in
        one integrated platform. <br /> Securely log in to access advanced
        charts for performance insights, <br />
        interactive maps for real-time tracking, and intuitive tools for
        exporting data. <br />
        Elevate your drone operations with powerful features designed to enhance
        efficiency and decision-making.
      </div>
      <div className="grid w-full grid-cols-3">
        <div className="justify-top flex flex-col items-center">
          <img src="/public/images/introduce/section02-main.png" alt="" className="w-[410px]"/>
          <div>
            Manage your drone flight data through our secure login system
          </div>
        </div>
        <div className="justify-top flex flex-col items-center">
          <img src="/public/images/introduce/section02-chart.png" alt="" className="w-[410px]"/>
          <div>
            Analyze every moment of your flight with powerful data visualization
            tools. Monitor flight status over time and export your analyzed data
            as images or Excel files.
          </div>
        </div>
        <div className="justify-top flex flex-col items-center">
          <img src="/public/images/introduce/section02-map.png" alt="" />
          <div>
            Track actual flight paths and drone attitude changes on our
            interactive map. Intuitively understand comprehensive flight
            information including weather conditions and altitude data.
          </div>
        </div>
      </div>
    </div>
  );
}