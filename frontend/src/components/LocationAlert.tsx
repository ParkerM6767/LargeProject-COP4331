import { AlertCircleIcon } from "lucide-react"
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "../components/ui/alert"

export function LocationAlert() {
  return (
    <Alert variant="destructive" className="max-w-md p-6 border-none">
      <AlertCircleIcon />
      <AlertTitle>User Location Unknown</AlertTitle>
      <AlertDescription>
        In order to post events please allow location sharing in settings or right-click to place pin.
      </AlertDescription>
    </Alert>
  )
}
