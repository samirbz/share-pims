const openPrintWindow = (htmlContent: string) => {
  const printWindow = window.open(
    "",
    "PRINT",
    "height=650,width=900,top=100,left=150"
  )

  if (printWindow) {
    printWindow.document.write(`
       <html>
          <head>
            <title>Print</title>
            <style>
              @media print {
                body {
                  margin: 0;
                  padding: 0;
                }
                header, footer {
                  display: none !important;
                }
              }
            </style>
          </head>
          <body>
            ${htmlContent}
          </body>
        </html>
      `)

    printWindow.document.close()

    // Wait for the image to load before printing
    const image = printWindow.document.querySelector("img")

    if (image) {
      image.onload = () => {
        printWindow.focus()
        printWindow.print()
        printWindow.close()
      }
    } else {
      // Fallback if no image is present
      printWindow.focus()
      printWindow.print()
      printWindow.close()
    }
  }
}

const PeskiVuktaniPrint = async ({
  aawa = "",
  miti = "",
  samjhautaMiti = "",
  place = "",
  palikaState = "",
  office = "",
  pradesh = "",
  karyaKramSuruMiti = "",
  karyaKramSampannaMiti = "",
  yojanaKaryakramKoNaam = "",
  nirnayaMiti = "",
  prastawanaSwikritiMiti = "",
  district = "",
  khudPauneRakam = "",
  kamGarneSamuh = "",
  peskiKista = "",
  karmachariKoPad = "",
  bankNaamKhataNum = "",
  samanikaranAnudan = "",
  puranoAawaYojana = false,
  peskiRakam = "",
  anyaTipaniBivaran = "",
  kulLagatRakam = "",
  biniyojitRakam = "",
  lagatSahabhagitaRakam = "",
  contengencyRakam = "",
  marmatSambharRakam = "",
  dharautiRakam = "",
  peskiKistaRakam = "",
  bankKoNaamKhataNum = "",
  kaamGarneSamuha = "",
  upavoktaSamitiKoNaam = "",
  costSourcesDetails = [],
}: {
  aawa?: string
  miti?: string
  samjhautaMiti?: string
  place?: string
  palikaState?: string
  office?: string
  pradesh?: string
  karyaKramSuruMiti?: string
  karyaKramSampannaMiti?: string
  yojanaKaryakramKoNaam?: string
  nirnayaMiti?: string
  prastawanaSwikritiMiti?: string
  district?: string
  khudPauneRakam?: string
  kamGarneSamuh?: string
  peskiKista?: string
  karmachariKoPad?: string
  bankNaamKhataNum?: string
  samanikaranAnudan?: string
  puranoAawaYojana?: boolean
  peskiRakam?: string
  anyaTipaniBivaran?: string
  kulLagatRakam?: string
  biniyojitRakam?: string
  lagatSahabhagitaRakam?: string
  contengencyRakam?: string
  marmatSambharRakam?: string
  dharautiRakam?: string
  peskiKistaRakam?: string
  bankKoNaamKhataNum?: string
  kaamGarneSamuha?: string
  upavoktaSamitiKoNaam?: string
  costSourcesDetails?: {
    anudan: string
    srot: string
    amount: string
  }[]
}) => {
  const imagePath = "/images/gov-logo.png"
  const blob = await fetch(imagePath).then((r) => r.blob())
  const arrayBuffer = await blob.arrayBuffer()
  const uint8Array = new Uint8Array(arrayBuffer)
  const base64String = btoa(
    uint8Array.reduce((acc, byte) => acc + String.fromCharCode(byte), "")
  )
  const imageDataUrl = `data:image/png;base64,${base64String}`

  const htmlContent = `
<!DOCTYPE html>
<html lang="ne">
  <head>
    <meta charset="UTF-8" />
    <title>पेश्की रकम निकासा</title>
    <style>
      body {
        margin: 0;
        padding: 0;
        color: #000;
      }
      h1,
      h2,
      h3,
      h4,
      h5,
      h6 {
        margin: 0;
      }
      hr {
        margin: 0;
      }

      .container {
        max-width: 800px;
        margin: 10px auto;
        padding: 20px;
      }

      .header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 15px;
      }

      .logo img {
        width: 100px;
        height: auto;
      }

      .title {
        flex: 1;
        text-align: center;
        margin-right: 20px;
      }

      .title h1,
      .title p,
      .title h3 {
        margin: 2px 0;
      }

      .info-bar {
        display: flex;
        justify-content: space-between;
        margin-top: 4px;
        font-size: 0.9rem;
      }

      .subject {
        margin-top: 10px;
        text-align: center;
        font-weight: bold;
        font-size: 1rem;
      }

      .section-title {
        text-align: center;
        font-weight: bold;
        text-decoration: underline;
        text-underline-offset: 4px;
      }

      p {
        font-size: 0.9rem;
        line-height: 1.5;
        margin: 4px 0;
        text-indent: 40px;
      }

      .signature-block {
        display: flex;
        justify-content: space-between;
        margin-top: 50px;
      }

      .signature {
        text-align: center;
        width: 120px;
        font-size: 0.85rem;
        border-top: 1px solid #000;
        padding-top: 6px;
      }

      /* Layout for योजनाको विवरण section */
      .yogana-section {
        display: flex;
        justify-content: space-between;
        gap: 30px;
        align-items: flex-start;
      }

      .yogana-section h1,
      .yogana-section h3 {
        margin-bottom: 8px;
      }

      @media print {
        @page {
          size: A4;
          margin: 1cm;
        }

        body {
          background-color: #fff;
        }

        .container {
          box-shadow: none !important;
          border-radius: 0 !important;
          padding: 10px !important;
          margin: 0 auto !important;
          width: auto;
        }

        .logo img {
          width: 80px;
        }

        .section-title,
        .subject {
          margin: 10px 0 6px !important;
        }

        .signature-block {
          margin-top: 30px;
        }
      }
    </style>
  </head>
  <body>
    <div class="container">
      <!-- Header -->
      <div class="header">
        <div class="logo">
          <img src="${imageDataUrl}" alt="Logo" />
        </div>
        <div class="title">
          <h3>सिद्धार्थनगर नगरपालिका</h3>
          <h3>नगर कार्यपलिकको कार्यालय</h3>
          <h4 style="font-weight: normal">सिद्धार्थनगर, रुपन्देही</h4>
          <h4 style="font-weight: normal">लुम्बिनी प्रदेश नेपाल</h4>

          <div class="info-bar">
            <h3 style="margin-left: 250px">(योजना शाखा)</h3>
            <p>मिति:- ${miti}</p>
          </div>

          <div class="subject">विषय:- पेश्की रकम निकासा दिने बारे ।</div>
        </div>
      </div>

      <!-- Subject Section -->

      <!-- <hr style="height: 2px; background-color: black; border: none" /> -->
      <div style="border-top: 2px solid black; border-left: 2px solid black">
        <h3 class="section-title">टिप्पणी र आदेश</h3>
        <p style="margin-left: -32px; margin-bottom: 0">
          <strong
            >आ.व. २०८१/८२- सङ्घीय समानिकरण अनुदान, सङ्घीय समानिकरण
            अनुदान,</strong
          >
        </p>
      </div>
      <div
        style="
          border-left: 2px solid black;
          border-top: 2px solid black;
          padding-left: 8px;
          padding-right: 8px;
        "
      >
        <h4 style="margin-top: 8px"><strong>श्रीमान,</strong></h4>
        <p style="width: 100%; text-align: justify">
          यस नगरपालिकाबाट स्वीकृत निम्न योजना / कार्यक्रम सञ्चालन गर्न नगरपालिका
          र उपभोक्ता समिति बिच मिति २०८२ /१/२८ मा सम्झौता भए अनुसार श्रीरामपुर
          गाउँ भित्र चौबैको घर देखि अगाडि पि.सी.सी. ढलान र श्रीरामपुर गाउँमा सडक
          ग्रेभल उपभोक्ता समिति बाट पेश्की रकम माग भएको ।
        </p>

        <!-- योजनाको विवरण Section with right-side ULs -->
        <h4 style="text-decoration: underline">योजनाको विवरण</h4>
        <p style="margin-bottom: 0px">
          योजनाको नाम:-
          <strong
            >श्रीरामपुर गाउँ भित्र चौबैको घर देखि अगाडि पि .सी.सी. ढलान र
            श्रीरामपुर गाउँमा सडक ग्रेभल</strong
          >
        </p>
        <div class="yogana-section">
          <!-- Left side: योजनाको विवरण -->
          <div style="flex: 2">
            <p>निर्माण/मर्मत कार्य भएको स्थान:- रोहिणी गाउँपालिका- १</p>
            <p>निर्णय मितिः- ${nirnayaMiti}</p>
            <p>सम्झौता मितिः- ${samjhautaMiti}</p>
            <p>कुल ल.ई रकम :- २१४,६१७.५५</p>
            <p>विनियोजन रकम रु. ${biniyojitRakam}</p>
            <p>जनसहभागिता रकम रु. २००,०००.००</p>
            <p>कन्टेन्जेन्सी रकम रु. ${contengencyRakam}</p>
            <p>मर्मत सम्भार रकम रु. ${marmatSambharRakam}</p>
            <p>खुद पाउने रकम रु. ${khudPauneRakam}</p>
            <p>आयोजना शुरु हुने मितिः- २०८२/१/२८</p>
            <p>आयोजना सम्पन्न हुने मितिः- २०८२/३/१०</p>
            <p style="font-size: small">
              <strong>जम्मा पेश्की:- रु.१०,०००.००</strong>
            </p>
            <p style="font-size: small">${anyaTipaniBivaran}</p>
          </div>

          <!-- Right side: लागत श्रोत + पेश्की भुक्तानी -->
          <div style="flex: 1.5; margin-top: 30px">
            <h5>लागत श्रोतको विवरण</h5>
            <hr />

            <p
              style="
                margin-left: -40px;
                display: flex;
                justify-content: space-between;
                font-size: small;
              "
            >
              सङ्घीय समानिकरण अनुदान:-
              <span>२००,०००</span>
            </p>
            <p
              style="
                margin-left: -40px;
                display: flex;
                justify-content: space-between;
                font-size: small;
              "
            >
              सङ्घीय समानिकरण अनुदान:-
              <span>२००,०००</span>
            </p>
            <p
              style="
                margin-left: -40px;
                display: flex;
                justify-content: space-between;
                font-size: small;
              "
            >
              सङ्घीय समानिकरण अनुदान:-
              <span>२००,०००</span>
            </p>
            <hr />
            <p
              style="
                margin-left: -40px;
                display: flex;
                justify-content: space-between;
                font-size: small;
              "
            >
              जम्मा रकम रुः- <span>२१४,६१७</span>
            </p>

            <h5>पेश्की भुक्तानी हुने श्रोतको विवरण</h5>
            <hr />

            <p
              style="
                margin-left: -40px;
                display: flex;
                justify-content: space-between;
                font-size: small;
              "
            >
              सङ्घीय समानिकरण अनुदान:-
              <span>२००,०००</span>
            </p>
            <p
              style="
                margin-left: -40px;
                display: flex;
                justify-content: space-between;
                font-size: small;
              "
            >
              सङ्घीय समानिकरण अनुदान:-
              <span>२००,०००</span>
            </p>
            <hr />
            <p
              style="
                margin-left: -40px;
                display: flex;
                justify-content: space-between;
                font-size: small;
              "
            >
              जम्मा रकम रुः- <span>२१४,६१७</span>
            </p>
          </div>
        </div>
        <hr />

        <p style="width: 100%; text-align: justify">
          उक्त योजना/कार्यक्रम सञ्चालनको लागि योजना कार्यक्रम सम्पन्न भए पछि
          पेश्की रकम फरफारक गर्ने गरी हाल रु.१०,०००.०० (अक्षेरुपी :-
          <strong>* दश हजार रूपैया मात्र ।</strong>) पेश्की रकम
          <strong
            >श्रीरामपुर गाउँ भित्र चौबैको घर देखि अगाडि पि.सी.सी. ढलान र
            श्रीरामपुर गाउँमा सडक ग्रेभल उपभोक्ता समिति</strong
          >
          को नाम मा रहेको खाता मा उपलब्ध गराउन मनासिव देखि निर्णयार्थ पेश गरेको
          छु ।
        </p>

        <!-- Signatures -->
        <div class="signature-block">
          <div class="signature">तयार गर्ने</div>
          <div class="signature">पेश गर्ने</div>
          <div class="signature">सदर गर्ने</div>
        </div>
      </div>
    </div>
  </body>
</html>



  `

  openPrintWindow(htmlContent)
}

export default PeskiVuktaniPrint
