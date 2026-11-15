/** Full-screen step between creating the purchase and the Przelewy24 payment page. */
export function PaymentLanding({ link, info }: { link: string; info: string }) {
  return (
    <div className="flex justify-center items-center pt-24">
      <div className="flex flex-col w-full md:w-1/2 items-center">
        <div>
          <p className="font-poppins text-2xl text-center">{info}</p>
        </div>
        <div>
          <a
            href={link}
            className="inline-block font-poppins text-xl md:text-2xl bg-bottega-dark-brown hover:bg-bottega-brown text-white border font-lato p-[10px] px-[40px] my-5 hover:shadow-lg transform transition ease-in-out"
          >
            Przejdź do płatności
          </a>
        </div>
      </div>
    </div>
  );
}
