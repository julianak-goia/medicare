import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <div className="gradient-bg min-h-screen">
        <div className="flex items-center justify-between p-8">
          <Image
            src="/images/medicare-logo.svg"
            alt="Imagem de uma médica no estilo de ilustração"
            width={120}
            height={120}
          />

          <div className="bg-primary rounded-full px-5 py-2">
            <Link href="/authentication" className="text-white">
              Login
            </Link>
          </div>
        </div>

        <div className="grid min-h-[80vh] grid-cols-2 gap-6">
          <div className="flex items-center justify-center">
            <div className="h-[480px] w-[480px]">
              <Image
                src="/images/doctor.svg"
                alt="Imagem de uma médica no estilo de ilustração"
                width={480}
                height={480}
              />
            </div>
          </div>
          <div className="flex flex-col items-start justify-center space-y-4">
            <div>
              <h2 className="text-5xl font-semibold text-white">
                Sua saúde é a nossa
              </h2>
              <h2 className="text-primary text-5xl font-semibold">
                prioridade
              </h2>
            </div>
            <div>
              <p>
                Atendimento humanizado, profissionais qualificados e tecnologia
              </p>
              <p>para oferecer o melhor para você e sua famílias</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
