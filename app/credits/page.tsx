import { credits } from "@/data/credits";
import { pageMeta } from "@/lib/seo";
import { PageHero } from "@/components/Page";

export const metadata = {
  ...pageMeta({ title: "Photo Credits", description: "Attribution for photos and logos used on the SLC Car Rental website.", path: "/credits/" }),
  robots: { index: false, follow: true },
};

export default function CreditsPage() {
  return (
    <main>
      <PageHero title="Photo credits" blurb="Photos of car models and cities are used under their licences from Wikimedia Commons. Car photos were cut out and placed on a white background." crumbs={[{ name: "Photo credits", path: "/credits/" }]}>
        <span />
      </PageHero>
      <section className="bg-surface py-12">
        <div className="container-x overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-[13.5px]">
            <thead className="text-[12px] tracking-wider text-muted uppercase">
              <tr><th className="py-2 pr-4">Used for</th><th className="py-2 pr-4">Author</th><th className="py-2 pr-4">Licence</th><th className="py-2">Source</th></tr>
            </thead>
            <tbody className="divide-y divide-edge">
              {credits.map((c) => (
                <tr key={c.what + c.file}>
                  <td className="py-2.5 pr-4 capitalize">{c.what}</td>
                  <td className="py-2.5 pr-4">{c.author}</td>
                  <td className="py-2.5 pr-4">{c.license}</td>
                  <td className="py-2.5"><a href={c.source} className="text-ink underline underline-offset-2" rel="noopener nofollow" target="_blank">{c.file}</a></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
