const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const enviarEmailRecuperacao = async (destinatario, nome, link) => {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.log(`ℹ️ EMAIL_USER/EMAIL_PASS não configurados no .env — link de redefinição (${destinatario}): ${link}`);
        return { enviado: false };
    }

    await transporter.sendMail({
        from: `"SMLDP" <${process.env.EMAIL_USER}>`,
        to: destinatario,
        subject: "Redefinição de senha - SMLDP",
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto;">
                <h2 style="color: #22c55e;">Redefinir sua senha</h2>
                <p>Olá, ${nome || "usuário"}!</p>
                <p>Recebemos um pedido para redefinir a senha da sua conta no SMLDP. Clique no botão abaixo para criar uma nova senha:</p>
                <p style="text-align: center; margin: 30px 0;">
                    <a href="${link}" style="background: #22c55e; color: #ffffff; padding: 14px 28px; border-radius: 50px; text-decoration: none; font-weight: bold;">Redefinir senha</a>
                </p>
                <p>Se você não pediu isso, pode ignorar este e-mail com segurança — sua senha continua a mesma.</p>
                <p style="color: #94a3b8; font-size: 12px;">Este link expira em 1 hora.</p>
            </div>
        `
    });

    return { enviado: true };
};

module.exports = { enviarEmailRecuperacao };
