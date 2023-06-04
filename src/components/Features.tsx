import features from "../data/features";

const Features = () => (
  <ul className="mt-2 flex gap-3 flex-wrap">
    {features.map((feature) => (
      <a
        key={feature.id}
        href={`/features/${feature.id}`}
        onClick={() => {
          window.launchControl.sendClickEvent(`feature:${feature.id}`);
        }}
      >
        <li className="px-4 py-1 grid place-items-center box-shadow border-2 border-black hover:bg-white active:scale-90">
          <feature.icon />
          <span className="text-2xl font-bold">{feature.title}</span>
        </li>
      </a>
    ))}
  </ul>
);

export default Features;
