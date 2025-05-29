"use client"
import {
  Button,
  Checkbox,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
  Select,
  SelectItem,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  useDisclosure,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Spinner,
  Pagination,
  ModalFooter,
  Radio,
  RadioGroup,
} from "@nextui-org/react"
import React, { useEffect, useState } from "react"
import NepaliDatePicker from "@zener/nepali-datepicker-react"
import NepaliDate from "nepali-date-converter"

import { FaRegSave } from "react-icons/fa"
import { MdModeEditOutline } from "react-icons/md"
import { RiArrowDownDoubleFill } from "react-icons/ri"
import {
  fetchWadaNumData,
  fetchYojanaBudgetDataSecond,
  fetchMukyaSamitiData,
  fetchAnudaanKoNaamData,
  fetchFilterLagatSrotData,
  fetchYojanaKaryaBivaranData,
  fetchYojanaPrakarData,
  fetchYojanaChanotNikayaData,
  saveYojanaDarta,
  fetchYojanaDartaData,
  deleteYojanaDarta,
  editYojanaDarta,
} from "@/actions/formAction"
import { ConvertToNepaliNumerals } from "@/lib/util"
import { toast } from "react-toastify"
import { AiOutlineClear, AiOutlinePlusCircle } from "react-icons/ai"
import { useMyContext, usePlaceContext } from "@/context/MyContext"
import {
  Committee,
  CostSource,
  Grant,
  PlanBudgetSecondary,
  PlanRegistration,
  PlanType,
  SelectionAgency,
  Ward,
  WorkDetail,
} from "@prisma/client"
import { Plus } from "lucide-react"

// Utility functions
const englishToNepali = (englishNum: string): string => {
  const nepaliDigits = "०१२३४५६७८९"
  const englishDigits = "0123456789"

  return englishNum
    .split("")
    .map((char) => {
      const index = englishDigits.indexOf(char)
      return index !== -1 ? nepaliDigits[index] : char
    })
    .join("")
}

const nepaliToEnglish = (nepaliNum: string): string => {
  const nepaliDigits = "०१२३४५६७८९"
  const englishDigits = "0123456789"

  return nepaliNum
    .split("")
    .map((char) => {
      const index = nepaliDigits.indexOf(char)
      return index !== -1 ? englishDigits[index] : char
    })
    .join("")
}

const isValidNumber = (value: string): boolean => {
  const allowedCharacters = /^[०-९0-9]*$/ // Nepali (०-९) and English (0-9) digits
  return allowedCharacters.test(value)
}

const date1 = new NepaliDate()

const qtyDataList = [
  { key: "1", label: "वटा" },
  { key: "2", label: "कि.मि" },
  { key: "3", label: "जना" },
  { key: "4", label: "मि." },
  { key: "5", label: "हे." },
  { key: "6", label: "र.मि." },
  { key: "7", label: "घ.मि." },
  { key: "8", label: "के.जि." },
  { key: "9", label: "थान " },
]
const karyagatSamuhaList = [
  { key: "1", label: "उपभोक्ता समिति" },
  { key: "2", label: "व्यक्तिगत" },
  { key: "3", label: "संस्थागत" },
  { key: "4", label: "अनुदान" },
]

const yojanaKoKisimList = [
  { key: "1", label: "अनुदान (गाउँ/नगरपालिका)" },
  { key: "2", label: "९०% अनुदान (९०/१० )" },
  { key: "3", label: "८०% अनुदान (८०/२० )" },
  { key: "4", label: "६०% अनुदान (६०/४०)" },
  { key: "5", label: "५०% अनुदान (५०/५०)" },
  { key: "6", label: "४०% अनुदान (४०/६०)" },
]
const budgetTypeList = [
  { key: "1", label: "ल.ई." },
  { key: "2", label: "प्रस्तावना" },
  { key: "3", label: "निवेदन" },
  { key: "4", label: "तोक आदेश" },
  { key: "5", label: "अन्य" },
]

export default function YojanaDarta() {
  // const [date, setDate] = useState<string>("")
  const [wadaN, setWadaN] = useState<Ward[]>([])

  // fill data
  const [yojanaKoNaamData, setYojanaKoNaamData] = useState<any[]>([])
  const [mukhyaSamitiData, setMukhyaSamitiData] = useState<Committee[]>([])

  // First lagat srot
  const [aunudaanKisimData, setAunudaanKisimData] = useState<Grant[]>([])
  const [lagatSrotData, setLagatSrotData] = useState<any[]>([])
  // const [budget, setBudget] = useState("")
  // Second lagat srot
  const [aunudaanKisimSecondData, setAunudaanKisimSecondData] = useState<
    Grant[]
  >([])
  const [lagatSrotSecondData, setLagatSrotSecondData] = useState<CostSource[]>(
    []
  )
  // const [budgetSecond, setBudgetSecond] = useState("")

  // Third lagat srot
  const [aunudaanKisimThirdData, setAunudaanKisimThirdData] = useState<Grant[]>(
    []
  )
  const [lagatSrotThirdData, setLagatSrotThirdData] = useState<any[]>([])
  // const [budgetThird, setBudgetThird] = useState("")

  const [yojanaKaryaBivaranData, setYojanaKaryaBivaranData] = useState<
    WorkDetail[]
  >([])

  const [ayojanaUpachetraData, setAyojanaUpachetraData] = useState<PlanType[]>(
    []
  )

  const [yojanaChanotNikaya, setYojanaChanotNikaya] = useState<
    SelectionAgency[]
  >([])

  const [totalSum, setTotalSum] = useState(0)

  const [loading, setLoading] = useState(true)
  const [showLoadingYojanaNaam, setShowLoadingYojanaNaam] = useState(false)
  const [showLoadingLagatSrot1, setShowLoadingLagatSrot1] = useState(false)
  const [showLoadingLagatSrot2, setShowLoadingLagatSrot2] = useState(false)
  const [showLoadingLagatSrot3, setShowLoadingLagatSrot3] = useState(false)

  const [showSecond, setShowSecond] = useState(false)
  const [showThird, setShowThird] = useState(false)

  const [sabhaNirnayaMiti, setSabhaNirnayaMiti] = useState("")
  const [prastabSwikritMiti, setPrastabSwikritMiti] = useState("")
  const [yojanaKoWada, setYojanaKoWada] = useState("")
  const [yojanaKoNaam, setYojanaKoNaam] = useState("")

  const [budgetKitabSnum, setBudgetKitabSnum] = useState("")
  const [savedBudgetKitabSnum, setSavedBudgetKitabSnum] = useState("")

  const [budgetUpaSirsak, setBudgetUpaSirsak] = useState("")
  const [savedBudgetUpaSirsak, setSavedBudgetUpaSirsak] = useState("")

  const [kharchaSirsak, setKharchaSirsak] = useState("")
  const [savedKharchaSirsak, setSavedKharchaSirsak] = useState("")

  const [mukhyaSamiti, setMukhyaSamiti] = useState("")
  const [anudanKoNaam, setAnudanKoNaam] = useState("")
  const [lagatSrotHaru, setLagatSrotHaru] = useState("")

  const [lagatSrotAmount, setLagatSrotAmount] = useState("")
  const [savedLagatSrotAmount, setSavedLagatSrotAmount] = useState("")

  const [anudanKoNaam2, setAnudanKoNaam2] = useState("")
  const [lagatSrotHaru2, setLagatSrotHaru2] = useState("")

  const [lagatSrotAmount2, setLagatSrotAmount2] = useState("")
  const [savedLagatSrotAmount2, setSavedLagatSrotAmount2] = useState("")

  const [anudanKoNaam3, setAnudanKoNaam3] = useState("")
  const [lagatSrotHaru3, setLagatSrotHaru3] = useState("")

  const [lagatSrotAmount3, setLagatSrotAmount3] = useState("")
  const [savedLagatSrotAmount3, setSavedLagatSrotAmount3] = useState("")

  const [yojanaUpachetra, setYojanaUpachetra] = useState("")
  const [yojanaKoKisim, setYojanaKoKisim] = useState("अनुदान (गाउँ/नगरपालिका)")
  // const [wada, setWada] = useState("")
  const [wada, setWada] = useState<string[]>([])
  const [karyagatSamuha, setKaryagatSamuha] = useState("उपभोक्ता समिति")

  const [prabidhikEstimateAmount, setPrabidhikEstimateAmount] = useState("")
  const [savedPrabidhikEstimateAmount, setSavedPrabidhikEstimateAmount] =
    useState("")

  const [budgetType, setBudgetType] = useState("ल.ई.")

  const [biniyojitRakam, setBiniyojitRakam] = useState(totalSum.toString())
  const [savedBiniyojitRakam, setSavedBiniyojitRakam] = useState(
    totalSum.toString()
  )

  const [yojanaSwikrit, setYojanaSwikrit] = useState("")

  const [contengency, setContengency] = useState("")
  const [savedContengency, setSavedContengency] = useState("")

  const [contengencyResult, setContengencyResult] = useState("")
  const [savedContengencyResult, setSavedContengencyResult] = useState("")

  const [marmatRakam, setMarmatRakam] = useState("")
  const [savedMarmatRakam, setSavedMarmatRakam] = useState("")

  const [markmatRakamResult, setMarkmatRakamResult] = useState("")
  const [savedMarkmatRakamResult, setSavedMarkmatRakamResult] = useState("")

  const [dharautiRakam, setDharautiRakam] = useState("")
  const [savedDharautiRakam, setSavedDharautiRakam] = useState("")

  const [dharautiRakamResult, setDharautiRakamResult] = useState("")
  const [savedDharautiRakamResult, setSavedDharautiRakamResult] = useState("")

  const [kulAnudaanRakam, setKulAnudaanRakam] = useState("")
  const [savedKulAnudaanRakam, setSavedKulAnudaanRakam] = useState("")

  const [janaSramdanRakam, setJanaSramdanRakam] = useState("")
  const [savedJanaSramdanRakam, setSavedJanaSramdanRakam] = useState("")

  const [thegana, setThegana] = useState("")

  const [gharPariwarSankhya, setGharPariwarSankhya] = useState("")
  const [savedGharPariwarSankhya, setSavedGharPariwarSankhya] = useState("")

  const [janaSankhya, setJanaSankhya] = useState("")
  const [savedJanaSankhya, setSavedJanaSankhya] = useState("")

  const [karyaBivaran, setKaryaBivaran] = useState("")

  const [upalabdhiLakshya, setUpalabdhiLakshya] = useState("")
  const [savedUpalabdhiLakshya, setSavedUpalabdhiLakshya] = useState("")

  const [uplabdhiLakhshyaQty, setUplabdhiLakhshyaQty] = useState("")
  const [barsikYojana, setBarsikYojana] = useState(true)
  const [kramagatYojana, setKramagatYojana] = useState(false)

  const [yojanaDartaData, setYojanaDartaData] = useState<PlanRegistration[]>([])

  const [fetchTable, setFetchTable] = useState(false)

  const [totalBudget, setTotalBudget] = useState("")

  const [btnDisable, setBtnDisable] = useState(false)

  const [editId, setEditId] = useState("")
  const [showEditBtn, setShowEditBtn] = useState(false)

  // two checkboxed
  const [selectedCheckbox, setSelectedCheckbox] = useState<string | null>(
    "barsik"
  )

  const [dateDisabled, setDateDisabled] = useState("उपभोक्ता समिति")

  const [clearAndCancelBtn, setClearAndCancelBtn] = useState(false)

  const { value } = useMyContext()
  const { place } = usePlaceContext()

  const handleBarsikYojanaChange = async () => {
    setSelectedCheckbox("barsik")
    setBarsikYojana(true)
    setKramagatYojana(false)
  }

  const handleKramagatYojanaChange = async () => {
    setSelectedCheckbox("kramagat")
    setKramagatYojana(true)
    setBarsikYojana(false)
  }

  useEffect(() => {
    const handleBarsikYojanaChange = async () => {
      setSelectedCheckbox("barsik")
      setBarsikYojana(true)
      setKramagatYojana(false)
    }

    const handleKramagatYojanaChange = async () => {
      setSelectedCheckbox("kramagat")
      setKramagatYojana(true)
      setBarsikYojana(false)
    }

    if (barsikYojana) {
      handleBarsikYojanaChange()
    } else {
      handleKramagatYojanaChange()
    }
  }, [barsikYojana, kramagatYojana])

  useEffect(() => {
    if (karyagatSamuha === "व्यक्तिगत" || karyagatSamuha === "संस्थागत") {
      // Set लागत सहभागिता (janaSramdanRakam) to 0 and prevent negative values
      setJanaSramdanRakam("०")
      setSavedJanaSramdanRakam("0")
      // Set कुल अनुदान रकम (kulAnudaanRakam) to प्राविधिक इस्टिमेट रकम (prabidhikEstimateAmount)
      setKulAnudaanRakam(prabidhikEstimateAmount)
      setSavedKulAnudaanRakam(nepaliToEnglish(prabidhikEstimateAmount))
    } else {
      // For other cases (like उपभोक्ता समिति), calculate as before
      const calculatedJanaSramdan = (
        Number(nepaliToEnglish(contengencyResult)) +
        Number(nepaliToEnglish(markmatRakamResult)) +
        Number(nepaliToEnglish(prabidhikEstimateAmount)) -
        Number(totalSum)
      ).toString()

      // Ensure no negative values for janaSramdanRakam
      const janaSramdanValue = Math.max(
        0,
        Number(calculatedJanaSramdan)
      ).toString()
      setJanaSramdanRakam(englishToNepali(janaSramdanValue))
      setSavedJanaSramdanRakam(janaSramdanValue)

      // Calculate कुल अनुदान रकम normally
      const calculatedKulAnudaan = (
        Number(totalSum) -
        (Number(nepaliToEnglish(contengencyResult)) +
          Number(nepaliToEnglish(markmatRakamResult)) +
          Number(nepaliToEnglish(dharautiRakamResult)))
      ).toString()
      setKulAnudaanRakam(englishToNepali(calculatedKulAnudaan))
      setSavedKulAnudaanRakam(calculatedKulAnudaan)
    }
  }, [
    karyagatSamuha,
    contengencyResult,
    markmatRakamResult,
    dharautiRakamResult,
    totalSum,
    prabidhikEstimateAmount,
  ])

  // const [inputValue, setInputValue] = useState<string>("")

  const [showDropdown, setShowDropdown] = useState<boolean>(false) // Control dropdown visibility

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // setInputValue(event.target.value)
    console.log(filteredOptions)
    setYojanaKoNaam(event.target.value)
    setShowDropdown(true) // Show dropdown when typing
  }

  // Handle item selection from dropdown
  const handleSelect = (option: string) => {
    // setInputValue(option)
    setYojanaKoNaam(option) // Bind the selected value
    setShowDropdown(false) // Close dropdown after selection
    fetchBudget(option) // Call fetchBudget when an item is selected
  }

  // Filter the options based on the input value
  const filteredOptions = yojanaKoNaamData.filter((option) =>
    option.plan.toLowerCase().includes(yojanaKoNaam.toLowerCase())
  )
  // end

  // fetch for auto fill according to yojana wadaNum
  const fetchYojanaNaam = async (wadaNum: any) => {
    setShowLoadingYojanaNaam(true)
    try {
      const data = await fetchYojanaBudgetDataSecond(value || "")
      const filteredData = data.filter(
        (item: PlanBudgetSecondary) => item.ward === wadaNum
      )
      setYojanaKoNaamData(filteredData)
    } catch (e) {
      console.error("Error fetching Yojana data", e)
    } finally {
      setShowLoadingYojanaNaam(false)
    }
  }

  const fetchBudget = async (yojanaKoNaamDt: string) => {
    try {
      const data = await fetchYojanaBudgetDataSecond(value || "")
      const filteredData = data.filter(
        (item: any) => item.plan === yojanaKoNaamDt
      )

      // Check if filteredData is not empty
      if (filteredData.length > 0) {
        // Assuming you want the first item if there are multiple matches
        const budgetData = filteredData[0].allocation
        setLagatSrotAmount(englishToNepali(budgetData))
        setTotalBudget(budgetData)
      } else {
        // Handle the case where no data was found
        setLagatSrotAmount("") // Or whatever default value makes sense
      }
    } catch (e) {
      console.error("Error fetching Yojana data", e)
    }
  }

  const fetchLagatSrotHaru = async (anudaanKoNaam: any) => {
    try {
      // Fetch the data from the API or data source
      const data = await fetchFilterLagatSrotData(anudaanKoNaam, value || "")

      // Set the filtered data in the state
      setLagatSrotData(data)
    } catch (e) {
      // Handle any errors that occur during the fetch or filtering process
      console.error("Error fetching Lagat Srot data", e)
    } finally {
      setShowLoadingLagatSrot1(false)
    }
  }
  const fetchSecondLagatSrotHaru = async (anudaanKoNaam: any) => {
    setShowLoadingLagatSrot2(true)
    try {
      // Fetch the data from the API or data source
      const data = await fetchFilterLagatSrotData(anudaanKoNaam, value || "")

      // Set the filtered data in the state
      setLagatSrotSecondData(data)
    } catch (e) {
      // Handle any errors that occur during the fetch or filtering process
      console.error("Error fetching Lagat Srot data", e)
    } finally {
      setShowLoadingLagatSrot2(false)
    }
  }
  const fetchThirdLagatSrotHaru = async (anudaanKoNaam: any) => {
    setShowLoadingLagatSrot3(true)
    try {
      // Fetch the data from the API or data source
      const data = await fetchFilterLagatSrotData(anudaanKoNaam, value || "")

      // Set the filtered data in the state
      setLagatSrotThirdData(data)
    } catch (e) {
      // Handle any errors that occur during the fetch or filtering process
      console.error("Error fetching data", e)
    } finally {
      setShowLoadingLagatSrot3(false)
    }
  }

  const fetchYojanaDarta = async () => {
    try {
      const data = await fetchYojanaDartaData(value || "")
      setYojanaDartaData(data)
    } catch (e) {
      console.error("Error fetching anudaan data", e)
    }
  }

  const clearAll = () => {
    setSabhaNirnayaMiti("")
    setPrastabSwikritMiti("")
    setYojanaKoWada("")
    setYojanaKoNaam("")
    setBudgetKitabSnum("")
    setBudgetUpaSirsak("")
    setKharchaSirsak("")
    setMukhyaSamiti("")
    setAnudanKoNaam("")
    setLagatSrotHaru("")
    setLagatSrotAmount("")
    setAnudanKoNaam2("")
    setLagatSrotHaru2("")
    setLagatSrotAmount2("")
    setAnudanKoNaam3("")
    setLagatSrotHaru3("")
    setLagatSrotAmount3("")
    setYojanaUpachetra("")
    setWada([])
    setDateDisabled("उपभोक्ता समिति")
    setPrabidhikEstimateAmount("")
    setBiniyojitRakam("")
    setYojanaSwikrit("")
    setContengency("")
    setContengencyResult("")
    setMarmatRakam("")
    setMarkmatRakamResult("")
    setDharautiRakam("")
    setDharautiRakamResult("")
    setKulAnudaanRakam("")
    setJanaSramdanRakam("")
    setThegana("")
    setGharPariwarSankhya("")
    setJanaSankhya("")
    setKaryaBivaran("")
    setUpalabdhiLakshya("")
    setUplabdhiLakhshyaQty("")
    setYojanaKoNaamData([])
    setShowEditBtn(false)
    setClearAndCancelBtn(false)
  }

  const onSubmit = async () => {
    const trimmedyojanaKoNaam = yojanaKoNaam.trimEnd()
    const budgetKistabSnumConvert = savedBudgetKitabSnum.trim()
    const budgetUpaSirsak = savedBudgetUpaSirsak.trim()
    const kharchaSirsak = savedKharchaSirsak.trim()
    const lagatSrotAmountConvert =
      savedLagatSrotAmount.trim() || lagatSrotAmount.trim()
    const lagatSrotAmount2Convert = savedLagatSrotAmount2.trim()
    const lagatSrotAmount3Convert = savedLagatSrotAmount3.trim()
    const biniyojitRakamConvert = savedBiniyojitRakam.trim()
    const prabidhikEstimateAmountConvert = savedPrabidhikEstimateAmount.trim()
    const contengencyConvert = savedContengency.trim()
    const contengencyResultConvert = savedContengencyResult.trim()
    const marmatRakamConvert = savedMarmatRakam.trim()
    const markmatRakamResultConvert = savedMarkmatRakamResult.trim()
    const dharautiRakamConvert = savedDharautiRakam.trim()
    const dharautiRakamResultConvert = savedDharautiRakamResult.trim()
    const kulAnudaanRakamConvert = savedKulAnudaanRakam.trim()
    const janaSramdanRakamConvert = savedJanaSramdanRakam.trim()
    const gharPariwarSankhyaConvert = savedGharPariwarSankhya.trim()
    const janaSankhyaConvert = savedJanaSankhya.trim()
    const upalabdhiLakshyaConvert = savedUpalabdhiLakshya.trim()

    // Check for duplicate plan names across all selected wards
    const existsYojanaKoNaam = yojanaDartaData.some(
      (data) =>
        data.plan === trimmedyojanaKoNaam &&
        data.ward.some((w) => wada.includes(w))
    )
    console.log(totalBudget)
    if (existsYojanaKoNaam) {
      toast.error("Duplicate yojana ko naam in one or more selected wards")
      return
    }

    if (
      karyagatSamuha === "उपभोक्ता समिति" &&
      Number(nepaliToEnglish(prabidhikEstimateAmount)) <
        Number(nepaliToEnglish(biniyojitRakam))
    ) {
      toast.error(
        "Prabidhik estimate amount is less than total biniyojit amount"
      )
      return
    }

    const result = await saveYojanaDarta(
      sabhaNirnayaMiti || date1.format("YYYY-MM-DD"),
      prastabSwikritMiti || date1.format("YYYY-MM-DD"),
      yojanaKoWada,
      trimmedyojanaKoNaam,
      budgetKistabSnumConvert,
      mukhyaSamiti,
      anudanKoNaam,
      lagatSrotHaru,
      lagatSrotAmountConvert,
      anudanKoNaam2,
      lagatSrotHaru2,
      lagatSrotAmount2Convert,
      anudanKoNaam3,
      lagatSrotHaru3,
      lagatSrotAmount3Convert,
      yojanaUpachetra,
      yojanaKoKisim,
      wada, // Pass the wada array
      karyagatSamuha,
      prabidhikEstimateAmountConvert,
      budgetType,
      biniyojitRakamConvert,
      yojanaSwikrit,
      contengencyConvert,
      contengencyResultConvert,
      marmatRakamConvert,
      markmatRakamResultConvert,
      dharautiRakamConvert,
      dharautiRakamResultConvert,
      kulAnudaanRakamConvert,
      janaSramdanRakamConvert,
      thegana,
      gharPariwarSankhyaConvert,
      janaSankhyaConvert,
      karyaBivaran,
      upalabdhiLakshyaConvert,
      uplabdhiLakhshyaQty,
      barsikYojana,
      kramagatYojana,
      value || "",
      budgetUpaSirsak,
      kharchaSirsak
    )

    if (result.status === "success") {
      clearAll()
      toast.success("Successfully created")
    } else {
      console.error("Error occurred during save")
      toast.error("Failed to save")
    }
  }

  const handleEdit = async (item: PlanRegistration, onClose: any) => {
    onClose()
    setShowEditBtn(true)
    setEditId(item.id.toString())

    // Map schema fields to form fields
    setSabhaNirnayaMiti(item.meetDate)
    setPrastabSwikritMiti(item.approveDate)
    setYojanaKoWada(item.ward[0] || "") // Use first ward for yojanaKoWada if needed
    setYojanaKoNaam(item.plan)
    setBudgetKitabSnum(englishToNepali(item.bookNo))
    setMukhyaSamiti(item.committee)

    // First funding source
    setAnudanKoNaam(item.grant1)
    setLagatSrotHaru(item.source1)
    setLagatSrotAmount(englishToNepali(item.amount1))

    // Second funding source
    setAnudanKoNaam2(item.grant2)
    setLagatSrotHaru2(item.source2)
    setLagatSrotAmount2(englishToNepali(item.amount2))

    // Third funding source
    setAnudanKoNaam3(item.grant3)
    setLagatSrotHaru3(item.source3)
    setLagatSrotAmount3(englishToNepali(item.amount3))

    // Project details
    setYojanaUpachetra(item.area)
    setYojanaKoKisim(item.category)
    setWada(item.ward) // Set wada as an array
    setKaryagatSamuha(item.group)
    setDateDisabled(item.group)
    setPrabidhikEstimateAmount(englishToNepali(item.techEstimate))
    setBudgetType(item.budgetType)
    setBiniyojitRakam(englishToNepali(item.allocated))
    setYojanaSwikrit(item.approved)

    // Calculations
    setContengency(englishToNepali(item.contingency))
    setContengencyResult(englishToNepali(item.contResult))
    setMarmatRakam(englishToNepali(item.maintenance))
    setMarkmatRakamResult(englishToNepali(item.maintResult))
    setDharautiRakam(englishToNepali(item.demolition))
    setDharautiRakamResult(englishToNepali(item.demoResult))

    // Totals
    setKulAnudaanRakam(englishToNepali(item.totalGrant))
    setJanaSramdanRakam(englishToNepali(item.donation))

    // Location info
    setThegana(item.collection)
    setGharPariwarSankhya(englishToNepali(item.households))
    setJanaSankhya(englishToNepali(item.population))

    // Work details
    setKaryaBivaran(item.workDesc)
    setUpalabdhiLakshya(englishToNepali(item.goal))
    setUplabdhiLakhshyaQty(item.goalQty)

    // Flags
    setBarsikYojana(item.annual)
    setKramagatYojana(item.sequential)

    setBudgetUpaSirsak(item.subtopic || "")
    setKharchaSirsak(item.costTopic || "")

    setYojanaKoNaamData([])
    setClearAndCancelBtn(true)
  }

  useEffect(() => {
    lagatSrotAmount2 === "" ? setShowSecond(false) : setShowSecond(true)
    lagatSrotAmount3 === "" ? setShowThird(false) : setShowThird(true)
  }, [lagatSrotAmount2, lagatSrotAmount3])

  const edit = async () => {
    const result = await editYojanaDarta({
      id: editId,
      sabhaNirnayaMiti,
      prastabSwikritMiti,
      yojanaKoWada,
      yojanaKoNaam,
      budgetKitabSnum: nepaliToEnglish(budgetKitabSnum),

      mukhyaSamiti,
      anudanKoNaam,
      lagatSrotHaru,
      lagatSrotAmount: nepaliToEnglish(lagatSrotAmount),
      anudanKoNaam2,
      lagatSrotHaru2,
      lagatSrotAmount2: nepaliToEnglish(lagatSrotAmount2),
      anudanKoNaam3,
      lagatSrotHaru3,
      lagatSrotAmount3: nepaliToEnglish(lagatSrotAmount3),
      yojanaUpachetra,
      yojanaKoKisim,
      wada,
      karyagatSamuha,
      prabidhikEstimateAmount: nepaliToEnglish(prabidhikEstimateAmount),
      budgetType,
      biniyojitRakam: nepaliToEnglish(biniyojitRakam),
      yojanaSwikrit,
      contengency: nepaliToEnglish(contengency),
      contengencyResult: nepaliToEnglish(contengencyResult),
      marmatRakam: nepaliToEnglish(marmatRakam),
      markmatRakamResult: nepaliToEnglish(markmatRakamResult),
      dharautiRakam: nepaliToEnglish(dharautiRakam),
      dharautiRakamResult: nepaliToEnglish(dharautiRakamResult),
      kulAnudaanRakam: nepaliToEnglish(kulAnudaanRakam),
      janaSramdanRakam: nepaliToEnglish(janaSramdanRakam),
      thegana,
      gharPariwarSankhya: nepaliToEnglish(gharPariwarSankhya),
      janaSankhya: nepaliToEnglish(janaSankhya),
      karyaBivaran,
      upalabdhiLakshya: nepaliToEnglish(upalabdhiLakshya),
      uplabdhiLakhshyaQty,
      barsikYojana,
      kramagatYojana,
      fiscalyear: value || "",
      budgetUpaSirsak,
      kharchaSirsak,
    })

    if (result.status === "success") {
      setClearAndCancelBtn(false)
      clearAll()
      toast.success("successfully edited")
    } else {
      console.error("Error occurred")
    }
  }

  useEffect(() => {
    const fetchWadaData = async () => {
      try {
        const data = await fetchWadaNumData(value || "")
        setWadaN(data)
      } catch (e) {
        console.error("Error fetching anudaan data", e)
      }
    }

    const fetchMukhyaSamiti = async () => {
      try {
        const data = await fetchMukyaSamitiData(value || "")
        // Filter the data based on the provided ID

        setMukhyaSamitiData(data)
      } catch (e) {
        console.error("Error fetching Mukhya Samiti data", e)
      }
    }

    const fetchAnudaanKoNaam = async () => {
      try {
        const data = await fetchAnudaanKoNaamData(value || "")
        // Filter the data based on the provided ID
        // const filteredData = data.filter((item: any) => item.id === id)
        setAunudaanKisimData(data)
      } catch (e) {
        console.error("Error fetching Mukhya Samiti data", e)
      }
    }

    const fetchSecondAnudaanKoNaam = async () => {
      try {
        const data = await fetchAnudaanKoNaamData(value || "")
        // Filter the data based on the provided ID
        // const filteredData = data.filter((item: any) => item.id === id)
        setAunudaanKisimSecondData(data)
      } catch (e) {
        console.error("Error fetching Mukhya Samiti data", e)
      }
    }

    const fetchThirdAnudaanKoNaam = async () => {
      try {
        const data = await fetchAnudaanKoNaamData(value || "")
        // Filter the data based on the provided ID
        // const filteredData = data.filter((item: any) => item.id === id)
        setAunudaanKisimThirdData(data)
      } catch (e) {
        console.error("Error fetching Mukhya Samiti data", e)
      }
    }

    const fetchYojanaKaryaBivaran = async () => {
      try {
        const data = await fetchYojanaKaryaBivaranData(value || "")
        setYojanaKaryaBivaranData(data)
      } catch (e) {
        // Handle any errors that occur during the fetch or filtering process
        console.error("Error fetching data", e)
      }
    }

    const ayojanaUpachetra = async () => {
      try {
        const data = await fetchYojanaPrakarData(value || "")
        setAyojanaUpachetraData(data)
      } catch (e) {
        // Handle any errors that occur during the fetch or filtering process
        console.error("Error fetching data", e)
      }
    }

    const fetYojanaChanotNikaya = async () => {
      try {
        const data = await fetchYojanaChanotNikayaData(value || "")
        setYojanaChanotNikaya(data)
      } catch (e) {
        // Handle any errors that occur during the fetch or filtering process
        console.error("Error fetching data", e)
      }
    }

    const fetchYojanaDarta = async () => {
      try {
        const data = await fetchYojanaDartaData(value || "")
        setYojanaDartaData(data)
      } catch (e) {
        console.error("Error fetching anudaan data", e)
      }
    }

    const fetchAllData = async () => {
      try {
        // Fetch all data concurrently
        await Promise.all([
          fetchWadaData(),
          fetchMukhyaSamiti(),
          fetchAnudaanKoNaam(),
          fetchSecondAnudaanKoNaam(),
          fetchThirdAnudaanKoNaam(),
          fetchYojanaKaryaBivaran(),
          ayojanaUpachetra(),
          fetYojanaChanotNikaya(),
          fetchYojanaDarta(),
        ])
      } catch (e) {
        console.error("Error fetching data", e)
      } finally {
        setLoading(false)
      }
    }

    fetchAllData()
  }, [value])

  useEffect(() => {
    setTotalSum(
      Number(nepaliToEnglish(lagatSrotAmount)) +
        Number(nepaliToEnglish(lagatSrotAmount2)) +
        Number(nepaliToEnglish(lagatSrotAmount3))
    )
  }, [lagatSrotAmount, lagatSrotAmount2, lagatSrotAmount3])

  useEffect(() => {
    setContengencyResult(
      ((Number(nepaliToEnglish(contengency)) / 100) * Number(totalSum))
        .toFixed(2)
        .toString()
    )
  }, [contengency, totalSum])

  useEffect(() => {
    setMarkmatRakamResult(
      ((Number(nepaliToEnglish(marmatRakam)) / 100) * Number(totalSum))
        .toFixed(2)
        .toString()
    )
  }, [marmatRakam, totalSum])

  useEffect(() => {
    setDharautiRakamResult(
      ((Number(nepaliToEnglish(dharautiRakam)) / 100) * Number(totalSum))
        .toFixed(2)
        .toString()
    )
  }, [dharautiRakam, totalSum])

  useEffect(() => {
    setKulAnudaanRakam(
      (
        Number(totalSum) -
        (Number(nepaliToEnglish(contengencyResult)) +
          Number(nepaliToEnglish(markmatRakamResult)) +
          Number(nepaliToEnglish(dharautiRakamResult)))
      ).toString()
    )
  }, [contengencyResult, markmatRakamResult, dharautiRakamResult, totalSum])

  useEffect(() => {
    setJanaSramdanRakam(
      (
        Number(nepaliToEnglish(contengencyResult)) +
        Number(nepaliToEnglish(markmatRakamResult)) +
        Number(nepaliToEnglish(prabidhikEstimateAmount)) -
        Number(totalSum)
      ).toString()
    )
  }, [
    contengencyResult,
    markmatRakamResult,
    dharautiRakamResult,
    totalSum,
    prabidhikEstimateAmount,
  ])

  useEffect(() => {
    setBiniyojitRakam(englishToNepali(totalSum.toString()))
  }, [totalSum])

  useEffect(() => {
    setContengencyResult(nepaliToEnglish(contengencyResult))
  }, [contengencyResult])

  useEffect(() => {
    setMarkmatRakamResult(nepaliToEnglish(markmatRakamResult))
  }, [markmatRakamResult])

  useEffect(() => {
    setDharautiRakamResult(nepaliToEnglish(dharautiRakamResult))
  }, [dharautiRakamResult])

  useEffect(() => {
    const fetchYojanaDarta = async () => {
      try {
        const data = await fetchYojanaDartaData(value || "")
        setYojanaDartaData(data)
      } catch (e) {
        console.error("Error fetching anudaan data", e)
      }
    }
    fetchYojanaDarta()
  }, [value])

  useEffect(() => {
    setBtnDisable(yojanaKoNaam.trim() === "")
    const fetchYojanaDarta = async () => {
      try {
        const data = await fetchYojanaDartaData(value || "")
        setYojanaDartaData(data)
      } catch (e) {
        console.error("Error fetching anudaan data", e)
      }
    }
    fetchYojanaDarta()
  }, [yojanaKoNaam, value])

  useEffect(() => {
    if (wada.length > 0) {
      setThegana(
        `${place} - ${wada.map((w) => ConvertToNepaliNumerals(w)).join(", ")}`
      )
    } else {
      setThegana(place)
    }
  }, [place, wada])

  useEffect(() => {
    const fetchLagatSrotHaru = async (anudaanKoNaam: any) => {
      try {
        // Fetch the data from the API or data source
        const data = await fetchFilterLagatSrotData(anudaanKoNaam, value || "")

        // Set the filtered data in the state
        setLagatSrotData(data)
      } catch (e) {
        // Handle any errors that occur during the fetch or filtering process
        console.error("Error fetching Lagat Srot data", e)
      } finally {
        setShowLoadingLagatSrot1(false)
      }
    }

    const fetchSecondLagatSrotHaru = async (anudaanKoNaam: any) => {
      setShowLoadingLagatSrot2(true)
      try {
        // Fetch the data from the API or data source
        const data = await fetchFilterLagatSrotData(anudaanKoNaam, value || "")

        // Set the filtered data in the state
        setLagatSrotSecondData(data)
      } catch (e) {
        // Handle any errors that occur during the fetch or filtering process
        console.error("Error fetching Lagat Srot data", e)
      } finally {
        setShowLoadingLagatSrot2(false)
      }
    }

    const fetchThirdLagatSrotHaru = async (anudaanKoNaam: any) => {
      setShowLoadingLagatSrot3(true)
      try {
        // Fetch the data from the API or data source
        const data = await fetchFilterLagatSrotData(anudaanKoNaam, value || "")

        // Set the filtered data in the state
        setLagatSrotThirdData(data)
      } catch (e) {
        // Handle any errors that occur during the fetch or filtering process
        console.error("Error fetching data", e)
      } finally {
        setShowLoadingLagatSrot3(false)
      }
    }

    fetchLagatSrotHaru(anudanKoNaam)
    fetchSecondLagatSrotHaru(anudanKoNaam2)
    fetchThirdLagatSrotHaru(anudanKoNaam3)
  }, [anudanKoNaam, anudanKoNaam2, anudanKoNaam3, value])

  useEffect(() => {
    if (sabhaNirnayaMiti) {
      const selectedDate = new NepaliDate(sabhaNirnayaMiti)
      const today = new NepaliDate()

      if (selectedDate > today) {
        alert("Future dates are not allowed")
        setSabhaNirnayaMiti(today.format("YYYY-MM-DD"))
      }
    }
  }, [sabhaNirnayaMiti])
  useEffect(() => {
    if (prastabSwikritMiti) {
      const selectedDate = new NepaliDate(prastabSwikritMiti)
      const today = new NepaliDate()

      if (selectedDate > today) {
        alert("Future dates are not allowed")
        setPrastabSwikritMiti(today.format("YYYY-MM-DD"))
      }
    }
  }, [prastabSwikritMiti])

  const { isOpen, onOpen, onOpenChange } = useDisclosure()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const confirmDelete = (id: string) => {
    setDeleteId(id)
    setIsModalOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (deleteId) {
      const result = await deleteYojanaDarta(deleteId, value || "")
      if (result.status === "success") {
        // Fetch the updated list of fiscal years
        fetchYojanaDarta()
      } else {
        console.error("Delete unsuccessful")
      }
      setIsModalOpen(false)
      setDeleteId(null)
    }
  }

  // Input change handler
  const handleInputChangeBudgetKitabSnum = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const input = e.target.value

    if (isValidNumber(input)) {
      const englishValue = nepaliToEnglish(input)
      const nepaliValue = englishToNepali(englishValue)

      setBudgetKitabSnum(nepaliValue)
      setSavedBudgetKitabSnum(englishValue)
    }
  }

  const handleInputChangeBudgetKharchaSirsak = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const input = e.target.value

    if (isValidNumber(input)) {
      const englishValue = nepaliToEnglish(input)
      const nepaliValue = englishToNepali(englishValue)

      setKharchaSirsak(nepaliValue)
      setSavedKharchaSirsak(englishValue)
    }
  }

  const handleInputBudgetUpaSirsak = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const input = e.target.value

    if (isValidNumber(input)) {
      const englishValue = nepaliToEnglish(input)
      const nepaliValue = englishToNepali(englishValue)

      setBudgetUpaSirsak(nepaliValue)
      setSavedBudgetUpaSirsak(englishValue)
    }
  }

  const handleInputChangelagatSrotAmount = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const input = e.target.value

    if (isValidNumber(input)) {
      const englishValue = nepaliToEnglish(input)
      const nepaliValue = englishToNepali(englishValue)

      setLagatSrotAmount(nepaliValue)
      setSavedLagatSrotAmount(englishValue)
    }
  }

  const handleInputChangelagatSrotAmount2 = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const input = e.target.value

    if (isValidNumber(input)) {
      const englishValue = nepaliToEnglish(input)
      const nepaliValue = englishToNepali(englishValue)

      setLagatSrotAmount2(nepaliValue)
      setSavedLagatSrotAmount2(englishValue)
    }
  }
  const handleInputChangelagatSrotAmount3 = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const input = e.target.value

    if (isValidNumber(input)) {
      const englishValue = nepaliToEnglish(input)
      const nepaliValue = englishToNepali(englishValue)

      setLagatSrotAmount3(nepaliValue)
      setSavedLagatSrotAmount3(englishValue)
    }
  }
  const handleInputChangeBiniyojitRakam = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const input = e.target.value

    if (isValidNumber(input)) {
      const englishValue = nepaliToEnglish(input)
      const nepaliValue = englishToNepali(englishValue)

      setBiniyojitRakam(nepaliValue)
      setSavedBiniyojitRakam(englishValue)
    }
  }
  const handleInputChangePrabidhikEstimateAmount = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const input = e.target.value

    if (isValidNumber(input)) {
      const englishValue = nepaliToEnglish(input)
      const nepaliValue = englishToNepali(englishValue)

      setPrabidhikEstimateAmount(nepaliValue)
      setSavedPrabidhikEstimateAmount(englishValue)
    }
  }
  const handleInputChangeContengency = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const input = e.target.value

    if (isValidNumber(input)) {
      const englishValue = nepaliToEnglish(input)
      const nepaliValue = englishToNepali(englishValue)

      setContengency(nepaliValue)
      setSavedContengency(englishValue)
    }
  }
  const handleInputChangeContengencyResult = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const input = e.target.value

    if (isValidNumber(input)) {
      const englishValue = nepaliToEnglish(input)
      const nepaliValue = englishToNepali(englishValue)

      setContengencyResult(nepaliValue)
      setSavedContengencyResult(englishValue)
      setContengency("")
    }
  }
  const handleInputChangeMarmatRakam = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const input = e.target.value

    if (isValidNumber(input)) {
      const englishValue = nepaliToEnglish(input)
      const nepaliValue = englishToNepali(englishValue)

      setMarmatRakam(nepaliValue)
      setSavedMarmatRakam(englishValue)
    }
  }
  const handleInputChangeMarmatRakamResult = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const input = e.target.value

    if (isValidNumber(input)) {
      const englishValue = nepaliToEnglish(input)
      const nepaliValue = englishToNepali(englishValue)

      setMarkmatRakamResult(nepaliValue)
      setSavedMarkmatRakamResult(englishValue)
      setMarmatRakam("")
    }
  }
  const handleInputChangeDharautiRakam = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const input = e.target.value

    if (isValidNumber(input)) {
      const englishValue = nepaliToEnglish(input)
      const nepaliValue = englishToNepali(englishValue)

      setDharautiRakam(nepaliValue)
      setSavedDharautiRakam(englishValue)
    }
  }
  const handleInputChangeDharautiRakamResult = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const input = e.target.value

    if (isValidNumber(input)) {
      const englishValue = nepaliToEnglish(input)
      const nepaliValue = englishToNepali(englishValue)

      setDharautiRakamResult(nepaliValue)
      setSavedDharautiRakamResult(englishValue)
      setDharautiRakam("")
    }
  }
  const handleInputChangeKulanudaanRakam = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const input = e.target.value

    if (isValidNumber(input)) {
      const englishValue = nepaliToEnglish(input)
      const nepaliValue = englishToNepali(englishValue)

      setKulAnudaanRakam(nepaliValue)
      setSavedKulAnudaanRakam(englishValue)
    }
  }
  const handleInputChangeJanaSramdanRakam = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const input = e.target.value

    if (isValidNumber(input)) {
      const englishValue = nepaliToEnglish(input)
      const nepaliValue = englishToNepali(englishValue)

      setJanaSramdanRakam(nepaliValue)
      setSavedJanaSramdanRakam(englishValue)
    }
  }
  const handleInputChangeGharpariwarSankhya = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const input = e.target.value

    if (isValidNumber(input)) {
      const englishValue = nepaliToEnglish(input)
      const nepaliValue = englishToNepali(englishValue)

      setGharPariwarSankhya(nepaliValue)
      setSavedGharPariwarSankhya(englishValue)
    }
  }
  const handleInputChangejanaSankhya = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const input = e.target.value

    if (isValidNumber(input)) {
      const englishValue = nepaliToEnglish(input)
      const nepaliValue = englishToNepali(englishValue)

      setJanaSankhya(nepaliValue)
      setSavedJanaSankhya(englishValue)
    }
  }
  const handleInputChangeUpalabdhiLakshya = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const input = e.target.value

    if (isValidNumber(input)) {
      const englishValue = nepaliToEnglish(input)
      const nepaliValue = englishToNepali(englishValue)

      setUpalabdhiLakshya(nepaliValue)
      setSavedUpalabdhiLakshya(englishValue)
    }
  }

  const [filterAyojanaKoNaam, setFilterAyojanaKoNaam] = useState("")
  const [page, setPage] = useState(1)
  const rowsPerPage = 7

  // Filter the full dataset first
  const filteredYojanaDartaData = React.useMemo(() => {
    return yojanaDartaData.filter((item) =>
      item.plan.toLowerCase().includes(filterAyojanaKoNaam.toLowerCase())
    )
  }, [filterAyojanaKoNaam, yojanaDartaData])

  // Paginate the filtered data
  const paginatedItems = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage
    const end = start + rowsPerPage
    return filteredYojanaDartaData.slice(start, end)
  }, [page, filteredYojanaDartaData])

  const totalPages = Math.ceil(filteredYojanaDartaData.length / rowsPerPage)

  return (
    <div className="flex flex-col justify-between bg-white ">
      <h1 className="form-title text-center text-xl font-semibold sm:text-2xl">
        योजना दर्ता ठेक्का पट्टा / वोलपत्र तथा दरभाउ पत्र/कोटेशन
      </h1>
      <br />
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="5xl">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="text-lg font-semibold">
                योजना दर्ता उपभोक्ता समिती/संस्थागत/व्यक्तिगत र संस्थागत अनुदान
              </ModalHeader>
              <ModalBody>
                <div className="flex flex-col gap-4">
                  {/* Filter Input */}
                  <Input
                    type="text"
                    placeholder="आयोजना नाम खोज्नुहोस्..."
                    value={filterAyojanaKoNaam}
                    onChange={(e) => setFilterAyojanaKoNaam(e.target.value)}
                    size="sm"
                    className="w-full"
                  />

                  {loading ? (
                    <div className="my-4 flex w-full justify-center">
                      <Spinner color="primary" />
                    </div>
                  ) : (
                    <Table
                      aria-label="Example static collection table"
                      className="h-auto min-w-full"
                      bottomContent={
                        <div className="flex w-full justify-center">
                          <Pagination
                            isCompact
                            showControls
                            showShadow
                            color="secondary"
                            page={page}
                            total={totalPages}
                            onChange={(page) => setPage(page)}
                          />
                        </div>
                      }
                    >
                      <TableHeader>
                        <TableColumn>सि.न.</TableColumn>
                        <TableColumn>योजनाको नाम</TableColumn>
                        <TableColumn>आयोजनको प्रकार</TableColumn>
                        <TableColumn>वडा न.</TableColumn>
                        <TableColumn>ल.ई रकम</TableColumn>
                        <TableColumn>कवोल रकम रु.</TableColumn>
                        <TableColumn>भ्याट रकम रु.</TableColumn>
                        <TableColumn>Edit</TableColumn>
                      </TableHeader>
                      <TableBody>
                        {paginatedItems.map((item, index) => {
                          return (
                            <TableRow key={item.id}>
                              <TableCell>
                                {(page - 1) * rowsPerPage + index + 1}
                              </TableCell>
                              <TableCell>{item.plan || "-"}</TableCell>
                              <TableCell>
                                {ayojanaUpachetraData.find(
                                  (data) =>
                                    data.id.toString() === item.area.toString()
                                )?.type || "-"}
                              </TableCell>
                              <TableCell>
                                {item.ward.length > 0
                                  ? item.ward
                                      .map((w) => ConvertToNepaliNumerals(w))
                                      .join(", ")
                                  : "-"}
                              </TableCell>
                              <TableCell>
                                {item.techEstimate
                                  ? ConvertToNepaliNumerals(item.techEstimate)
                                  : "-"}
                              </TableCell>
                              <TableCell>
                                {item.totalGrant
                                  ? ConvertToNepaliNumerals(item.totalGrant)
                                  : "-"}
                              </TableCell>
                              <TableCell>
                                {item.donation
                                  ? ConvertToNepaliNumerals(item.donation)
                                  : "-"}
                              </TableCell>
                              <TableCell>
                                <Dropdown>
                                  <DropdownTrigger>
                                    <Button
                                      className="z-10"
                                      variant="shadow"
                                      size="sm"
                                      startContent={<MdModeEditOutline />}
                                    ></Button>
                                  </DropdownTrigger>
                                  <DropdownMenu aria-label="Static Actions">
                                    <DropdownItem
                                      onPress={() => handleEdit(item, onClose)}
                                    >
                                      Edit
                                    </DropdownItem>
                                    <DropdownItem
                                      key="delete"
                                      className="text-danger"
                                      color="danger"
                                      onPress={() =>
                                        confirmDelete(item.id.toString())
                                      }
                                    >
                                      Delete
                                    </DropdownItem>
                                  </DropdownMenu>
                                </Dropdown>
                              </TableCell>
                            </TableRow>
                          )
                        })}
                      </TableBody>
                    </Table>
                  )}
                </div>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <ModalContent>
          <ModalHeader>Confirm Deletion</ModalHeader>
          <ModalBody>Are you sure you want to delete?</ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button color="danger" onClick={handleConfirmDelete}>
              Delete
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <div className="flex w-full flex-col gap-4 sm:flex-row">
        <div className="flex w-full flex-col gap-2 sm:w-2/3">
          <div className="flex flex-col items-center gap-2 sm:flex-row">
            <form className="flex items-center gap-2 pl-2 sm:p-0 w-1/3">
              <label htmlFor="date" className="block text-sm">
                सभा निर्णय मिति
              </label>
              {/* <NepaliDatePicker
                inputClassName="form-control"
                className="rounded-lg border p-1"
                value={sabhaNirnayaMiti}
                onChange={(value: string) => setSabhaNirnayaMiti(value)}
                options={{ calenderLocale: "ne", valueLocale: "en" }}
              /> */}

              <NepaliDatePicker
                className="w-full max-w-sm rounded-lg border p-1"
                value={
                  sabhaNirnayaMiti || new NepaliDate().format("YYYY-MM-DD")
                }
                onChange={(date) =>
                  date
                    ? setSabhaNirnayaMiti(date.toString())
                    : setSabhaNirnayaMiti("")
                }
              />
            </form>
            <Select
              label="योजनाको वडा"
              className="w-full sm:w-1/3"
              size="sm"
              onChange={(e) => {
                fetchYojanaNaam(e.target.value)
              }}
              endContent={loading && <Spinner color="primary" />}
              placeholder="Select an option" // Optional: if you want a placeholder
              selectedKeys={yojanaKoWada ? new Set([yojanaKoWada]) : new Set()} // Binding the selected value
              onSelectionChange={(keys) => {
                const selectedValue = Array.from(keys).join(", ")
                setYojanaKoWada(selectedValue)
              }}
            >
              {wadaN.map((item) => (
                <SelectItem key={item.num}>
                  {ConvertToNepaliNumerals(item.num)}
                </SelectItem>
              ))}
            </Select>
            <Input
              type="text"
              label="बजेट किताब सि.न."
              size="sm"
              className="w-full sm:w-1/3 float-end"
              color="primary"
              value={budgetUpaSirsak}
              onChange={handleInputBudgetUpaSirsak}
            />
          </div>
          <div className="flex items-center gap-2">
            <div className="relative mx-auto w-full">
              <Select
                label="योजनाको नाम"
                size="sm"
                className="w-full"
                placeholder="Select an option" // Optional: if you want a placeholder
                selectedKeys={
                  mukhyaSamiti ? new Set([mukhyaSamiti]) : new Set()
                } // Binding the selected value
                onSelectionChange={(keys) => {
                  const selectedValue = Array.from(keys).join(", ")
                  setMukhyaSamiti(selectedValue)
                }}
                startContent={loading && <Spinner color="primary" />}
              >
                {mukhyaSamitiData.map((item) => (
                  <SelectItem key={item.id} value={item.id}>
                    {item.name}
                  </SelectItem>
                ))}
              </Select>

              {showLoadingYojanaNaam && (
                <div className="absolute right-2 top-2">
                  {/* Loading spinner when fetching data */}
                  <svg
                    className="size-5 animate-spin text-blue-500"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8H4z"
                    ></path>
                  </svg>
                </div>
              )}

              {showDropdown && filteredOptions.length > 0 && (
                <ul className="absolute z-50 mt-1 max-h-40 w-full overflow-auto rounded-md border border-gray-300 bg-white shadow-lg">
                  {filteredOptions.map((item, index) => (
                    <li
                      key={index}
                      className="cursor-pointer px-4 py-2 hover:bg-blue-500 hover:text-white"
                      onMouseDown={() => handleSelect(item.plan)} // Handle selection
                    >
                      {item.plan}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* <Input
              type="text"
              label="बजेट किताब सि.न."
              size="sm"
              className="w-full sm:w-1/3"
              color="primary"
              value={budgetKitabSnum}
              onChange={handleInputChangeBudgetKitabSnum}
            /> */}
          </div>
          <div className="flex items-center gap-2">
            <Select
              label="मूख्य समिति"
              size="sm"
              className="w-full"
              placeholder="Select an option" // Optional: if you want a placeholder
              selectedKeys={mukhyaSamiti ? new Set([mukhyaSamiti]) : new Set()} // Binding the selected value
              onSelectionChange={(keys) => {
                const selectedValue = Array.from(keys).join(", ")
                setMukhyaSamiti(selectedValue)
              }}
              startContent={loading && <Spinner color="primary" />}
            >
              {mukhyaSamitiData.map((item) => (
                <SelectItem key={item.id} value={item.id}>
                  {item.name}
                </SelectItem>
              ))}
            </Select>

            <RadioGroup orientation="horizontal" className="w-full">
              <Radio value="buenos-aires">वार्षिक योजना</Radio>
              <Radio value="sydney">क्रमागत योजना</Radio>
            </RadioGroup>
          </div>
          {/* First div  */}
          <div className="flex flex-col gap-2">
            <div className="flex w-full items-center gap-2">
              <p className="text-sm ">लागत&nbsp;श्रोत&nbsp;1</p>
              <Select
                label="अनुदानको नाम"
                size="sm"
                className="w-1/4"
                onChange={(e) => {
                  fetchLagatSrotHaru(e.target.value)
                }}
                selectedKeys={
                  anudanKoNaam ? new Set([anudanKoNaam]) : new Set()
                } // Binding the selected value
                onSelectionChange={(keys) => {
                  const selectedValue = Array.from(keys).join(", ")
                  setAnudanKoNaam(selectedValue)
                  setShowLoadingLagatSrot1(true)
                }}
                startContent={loading && <Spinner color="primary" />}
              >
                {aunudaanKisimData.map((item) => (
                  <SelectItem key={item.id} value={item.id}>
                    {item.name}
                  </SelectItem>
                ))}
              </Select>

              <Select
                label="लागत श्रोतहरु"
                size="sm"
                className="w-1/2"
                selectedKeys={
                  lagatSrotHaru ? new Set([lagatSrotHaru]) : new Set()
                }
                onSelectionChange={(keys) => {
                  const selectedValue = Array.from(keys).join(", ")
                  setLagatSrotHaru(selectedValue)
                }}
                endContent={showLoadingLagatSrot1 && <Spinner size="sm" />}
              >
                {lagatSrotData.map((item) => (
                  <SelectItem key={item.id} value={item.id}>
                    {item.name}
                  </SelectItem>
                ))}
              </Select>
              <Input
                type="text"
                label="रकम "
                size="sm"
                className="w-1/4"
                value={lagatSrotAmount}
                onChange={handleInputChangelagatSrotAmount}
              />
            </div>

            {/* Second div - toggleable */}
            {showSecond && (
              <div className="flex w-full items-center gap-2">
                <p className="text-sm ">लागत&nbsp;श्रोत&nbsp;2</p>
                <Select
                  label="अनुदानको नाम"
                  size="sm"
                  className="w-1/4"
                  onChange={(e) => {
                    fetchSecondLagatSrotHaru(e.target.value)
                  }}
                  selectedKeys={
                    anudanKoNaam2 ? new Set([anudanKoNaam2]) : new Set()
                  }
                  onSelectionChange={(keys) => {
                    const selectedValue = Array.from(keys).join(", ")
                    setAnudanKoNaam2(selectedValue)
                  }}
                >
                  {aunudaanKisimSecondData.map((item) => (
                    <SelectItem key={item.id} value={item.id}>
                      {item.name}
                    </SelectItem>
                  ))}
                </Select>
                <Select
                  label="लागत श्रोतहरु"
                  size="sm"
                  className="w-1/2"
                  selectedKeys={
                    lagatSrotHaru2 ? new Set([lagatSrotHaru2]) : new Set()
                  }
                  onSelectionChange={(keys) => {
                    const selectedValue = Array.from(keys).join(", ")
                    setLagatSrotHaru2(selectedValue)
                  }}
                  endContent={
                    showLoadingLagatSrot2 ? <Spinner size="sm" /> : ""
                  }
                >
                  {lagatSrotSecondData.map((item) => (
                    <SelectItem key={item.id} value={item.id}>
                      {item.name}
                    </SelectItem>
                  ))}
                </Select>
                <Input
                  type="text"
                  label="रकम "
                  size="sm"
                  className="w-1/4"
                  value={lagatSrotAmount2}
                  onChange={handleInputChangelagatSrotAmount2}
                />
              </div>
            )}

            {/* Third div - toggleable */}
            {showThird && (
              <div className="flex w-full items-center gap-2">
                <p className="text-sm ">लागत&nbsp;श्रोत&nbsp;3</p>
                <Select
                  label="अनुदानको नाम"
                  size="sm"
                  className="w-1/4"
                  onChange={(e) => {
                    fetchThirdLagatSrotHaru(e.target.value)
                  }}
                  selectedKeys={
                    anudanKoNaam3 ? new Set([anudanKoNaam3]) : new Set()
                  }
                  onSelectionChange={(keys) => {
                    const selectedValue = Array.from(keys).join(", ")
                    setAnudanKoNaam3(selectedValue)
                  }}
                >
                  {aunudaanKisimThirdData.map((item) => (
                    <SelectItem key={item.id} value={item.id}>
                      {item.name}
                    </SelectItem>
                  ))}
                </Select>
                <Select
                  label="लागत श्रोतहरु"
                  size="sm"
                  className="w-1/2"
                  selectedKeys={
                    lagatSrotHaru3 ? new Set([lagatSrotHaru3]) : new Set()
                  }
                  onSelectionChange={(keys) => {
                    const selectedValue = Array.from(keys).join(", ")
                    setLagatSrotHaru3(selectedValue)
                  }}
                  endContent={
                    showLoadingLagatSrot3 ? <Spinner size="sm" /> : ""
                  }
                >
                  {lagatSrotThirdData.map((item) => (
                    <SelectItem key={item.id} value={item.id}>
                      {item.name}
                    </SelectItem>
                  ))}
                </Select>
                <Input
                  type="text"
                  label="रकम "
                  size="sm"
                  className="w-1/4"
                  value={lagatSrotAmount3}
                  onChange={handleInputChangelagatSrotAmount3}
                />
              </div>
            )}

            {/* Toggle buttons aligned right */}
            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setShowSecond((prev) => !prev)
                  if (showSecond) setLagatSrotAmount2("")
                }}
                className={`rounded-md px-4 py-2 text-white ${
                  showSecond
                    ? "bg-red-500 hover:bg-red-600"
                    : "bg-green-500 hover:bg-green-600"
                }`}
              >
                {showSecond ? "-" : "+"} लागत श्रोत २
              </button>

              <button
                onClick={() => {
                  setShowThird((prev) => !prev)
                  if (showThird) setLagatSrotAmount3("")
                }}
                className={`rounded-md px-4 py-2 font-medium text-white ${
                  showThird
                    ? "bg-red-500 hover:bg-red-600"
                    : "bg-green-500 hover:bg-green-600"
                }`}
              >
                {showThird ? "-" : "+"} लागत श्रोत ३
              </button>
            </div>
          </div>

          <Select
            label="आयोजनाको प्रकार"
            size="sm"
            className="w-full"
            placeholder="Select an option" // Optional: if you want a placeholder
            selectedKeys={
              yojanaUpachetra ? new Set([yojanaUpachetra]) : new Set()
            } // Binding the selected value
            onSelectionChange={(keys) => {
              const selectedValue = Array.from(keys).join(", ")
              setYojanaUpachetra(selectedValue)
            }}
            startContent={loading && <Spinner color="primary" />}
          >
            {ayojanaUpachetraData.map((item) => (
              <SelectItem key={item.id} value={item.id}>
                {item.type}
              </SelectItem>
            ))}
          </Select>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Select
              label="योजनाको स्थान"
              className="w-full sm:w-1/2"
              size="sm"
              color="success"
              placeholder="Select an option" // Optional: if you want a placeholder
              selectedKeys={
                yojanaKoKisim ? new Set([yojanaKoKisim]) : new Set()
              } // Binding the selected value
              onSelectionChange={(keys) => {
                const selectedValue = Array.from(keys).join(", ")
                setYojanaKoKisim(selectedValue)
              }}
            >
              {yojanaKoKisimList.map((item) => (
                <SelectItem key={item.label}>{item.label}</SelectItem>
              ))}
            </Select>
            <Select
              label="वडा न."
              className="w-full sm:w-1/5"
              size="sm"
              placeholder="Select options"
              selectionMode="multiple"
              selectedKeys={new Set(wada)} // Bind to wada array
              onSelectionChange={(keys) => {
                const selectedValues = Array.from(keys) as string[]
                setWada(selectedValues) // Store selected values as array
              }}
            >
              {wadaN.map((item) => (
                <SelectItem key={item.num} value={item.num}>
                  {ConvertToNepaliNumerals(item.num)}
                </SelectItem>
              ))}
            </Select>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            {dateDisabled !== "उपभोक्ता समिति" && (
              <form className="flex items-center gap-2 pl-2 sm:p-0">
                <label htmlFor="date" className="block text-sm">
                  प्रस्ताव स्वीकृत मिति
                </label>
                {/* <NepaliDatePicker
                  inputClassName="form-control"
                  className="rounded-lg border p-1"
                  value={prastabSwikritMiti}
                  onChange={(value: string) => setPrastabSwikritMiti(value)}
                  options={{ calenderLocale: "ne", valueLocale: "en" }}
                /> */}

                <NepaliDatePicker
                  className="w-full max-w-sm rounded-lg border p-1"
                  value={
                    prastabSwikritMiti || new NepaliDate().format("YYYY-MM-DD")
                  }
                  onChange={(date) =>
                    date
                      ? setPrastabSwikritMiti(date.toString())
                      : setPrastabSwikritMiti("")
                  }
                />
              </form>
            )}
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <Input
              type="text"
              label="लागत इस्टिमेट रकम रु."
              size="sm"
              className="w-full sm:w-1/2"
              // onChange={(e) => {
              //   setPravidik(e.target.value)
              // }}
              value={prabidhikEstimateAmount}
              onChange={handleInputChangePrabidhikEstimateAmount}
              // value={pravidik}
            />
            <Select
              label="योजना कार्य किसिम"
              size="sm"
              className="w-full sm:w-1/2"
              color="success"
              placeholder="Select an option"
              selectedKeys={
                yojanaSwikrit ? new Set([yojanaSwikrit]) : new Set()
              }
              onSelectionChange={(keys) => {
                const selectedValue = Array.from(keys).join(", ")
                setYojanaSwikrit(selectedValue)
              }}
            >
              {yojanaChanotNikaya.map((item) => (
                <SelectItem key={item.agency}>{item.agency}</SelectItem>
              ))}
            </Select>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Input
              type="text"
              label="विनियोजित रकम रु."
              size="sm"
              className="w-full sm:w-1/2"
              value={englishToNepali(biniyojitRakam)}
              onChange={handleInputChangeBiniyojitRakam}
            />
            <Select
              label="योजना कार्य विवरण"
              size="sm"
              className="w-full sm:w-1/2"
              color="success"
              placeholder="Select an option"
              selectedKeys={
                yojanaSwikrit ? new Set([yojanaSwikrit]) : new Set()
              }
              onSelectionChange={(keys) => {
                const selectedValue = Array.from(keys).join(", ")
                setYojanaSwikrit(selectedValue)
              }}
            >
              {yojanaChanotNikaya.map((item) => (
                <SelectItem key={item.agency}>{item.agency}</SelectItem>
              ))}
            </Select>
          </div>

          <Button
            onPress={onOpen}
            onClick={() =>
              fetchTable ? setFetchTable(false) : setFetchTable(true)
            }
            color="primary"
            className="mt-4 w-full sm:w-1/4"
          >
            Open table <RiArrowDownDoubleFill />
          </Button>
          {/* <Button
            color="default"
            className="mt-2 w-full sm:w-1/4"
            onPress={clearAll}
          >
            Reset Form
          </Button> */}
        </div>

        <div className="flex w-full flex-col gap-4 sm:w-1/3">
          <div className="flex flex-col gap-2">
            <div className="flex gap-2">
              <Input
                type="text"
                label="कबोल रु. (भ्याट बाहेक)"
                size="sm"
                className="w-full"
                value={contengency}
                onChange={handleInputChangeContengency}
              />
            </div>
            <div className="flex gap-2">
              <Input
                type="text"
                label="भ्याट रकम रु."
                size="sm"
                className="w-full"
                value={englishToNepali(marmatRakam)}
                onChange={handleInputChangeMarmatRakam}
              />
            </div>
            <div className="flex gap-2">
              <Input
                type="text"
                label="भ्याट नलाग्ने रकम रु."
                size="sm"
                className="w-full"
                value={englishToNepali(dharautiRakam)}
                onChange={handleInputChangeDharautiRakam}
              />
            </div>
            <Input
              type="text"
              label="कुल कवोल रकम भ्याटसहित रु."
              size="sm"
              className="w-full"
              value={englishToNepali(kulAnudaanRakam)}
              onChange={handleInputChangeKulanudaanRakam}
              readOnly
            />
            <div className="flex gap-2">
              <Input
                type="text"
                // label="जनश्रमदान रु."
                label="कन्टेन्जेन्सी रकम वा %"
                size="sm"
                className="w-full"
                value={englishToNepali(janaSramdanRakam)}
                onChange={handleInputChangeJanaSramdanRakam}
              />
              <Input
                type="text"
                // label="जनश्रमदान रु."
                label="&nbsp;"
                size="sm"
                className="w-full"
                value={englishToNepali(janaSramdanRakam)}
                onChange={handleInputChangeJanaSramdanRakam}
              />
            </div>
            <div className="flex gap-2">
              <Input
                type="text"
                // label="जनश्रमदान रु."
                label="मर्मत सम्भार कोष %"
                size="sm"
                className="w-full"
                value={englishToNepali(janaSramdanRakam)}
                onChange={handleInputChangeJanaSramdanRakam}
              />
              <Input
                type="text"
                // label="जनश्रमदान रु."
                label="&nbsp;"
                size="sm"
                className="w-full"
                value={englishToNepali(janaSramdanRakam)}
                onChange={handleInputChangeJanaSramdanRakam}
              />
            </div>
            <div className="flex font-bold text-amber-900 items-center gap-2">
              <label className="text-nowrap">जम्मा रकम रु.</label>
              <Input type="number" value="0" size="lg" className="w-full" />
            </div>
            <Input
              type="text"
              label="योजना ठेगाना"
              size="sm"
              className="w-full"
              value={gharPariwarSankhya}
              onChange={handleInputChangeGharpariwarSankhya}
            />

            <div className="flex gap-2">
              <Input
                type="text"
                label="लक्षित उपलब्धि"
                size="sm"
                className="w-full"
                value={upalabdhiLakshya}
                onChange={handleInputChangeUpalabdhiLakshya}
              />
              <Select
                label="उपलब्धि&nbsp;किसिम"
                size="sm"
                className="w-full"
                placeholder="Select an option" // Optional: if you want a placeholder
                selectedKeys={
                  uplabdhiLakhshyaQty
                    ? new Set([uplabdhiLakhshyaQty])
                    : new Set()
                } // Binding the selected value
                onSelectionChange={(keys) => {
                  const selectedValue = Array.from(keys).join(", ")
                  setUplabdhiLakhshyaQty(selectedValue)
                }}
              >
                {qtyDataList.map((item) => (
                  <SelectItem key={item.label}>{item.label}</SelectItem>
                ))}
              </Select>
            </div>
          </div>

          <div className="flex gap-2">
            {showEditBtn ? (
              <Button
                color="primary"
                startContent={<MdModeEditOutline />}
                className="w-12"
                onClick={edit}
              >
                Edit
              </Button>
            ) : (
              <Button
                color="primary"
                startContent={<FaRegSave />}
                className="w-12"
                onClick={onSubmit}
                isDisabled={!yojanaKoNaam.trimEnd() || btnDisable}
              >
                Save
              </Button>
            )}
            <Button
              startContent={<AiOutlineClear />}
              onPress={clearAll}
              className="w-12"
            >
              {clearAndCancelBtn ? "Cancel" : "Clear"}
            </Button>
            <Button startContent={<AiOutlinePlusCircle />} className="w-fit">
              Add new
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
