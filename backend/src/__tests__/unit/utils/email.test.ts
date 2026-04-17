const sendMailMock = jest.fn()

jest.mock("nodemailer", () => ({
  createTransport: jest.fn(() => ({
    sendMail: sendMailMock
  }))
}))

// IMPORTANT: import AFTER mock
import { sendVerificationEmail } from "../../../utils/email"

describe("sendVerificationEmail", () => {

  beforeEach(() => {
    sendMailMock.mockClear()
  })

  it("should send verification email with correct content", async () => {

    await sendVerificationEmail("test@test.com", "123456")

    expect(sendMailMock).toHaveBeenCalledTimes(1)

    expect(sendMailMock).toHaveBeenCalledWith(
      expect.objectContaining({
        to: "test@test.com",
        subject: "Email Verification Code",
        html: expect.stringContaining("123456")
      })
    )
  })

})