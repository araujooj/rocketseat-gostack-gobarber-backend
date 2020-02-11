<h1 align="center">
  <img alt="GoBarber" title="GoBarber" src="https://i.ibb.co/x6gTQqm/gobarber.png" width="100px" />
</h1>

<h3 align="center">
  Backend GoBarber
</h3>

<p>
Essa é a aplicação principal construída na jornada do bootcamp GoStack da Rocketseat. Esse repositório em específico 
contém o backend da aplicação, onde residem a base de conceitos e prática para os desafios propostos durante o bootcamp
</p>

<blockquote align="center">“Sempre passar o que você aprendeu. - Mestre Yoda”</blockquote>

<p align="center">
  <a href="#rocket-sobre-a=aplicacao">Sobre a aplicação</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#-funcionalides">Funcionalidades</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#-exemplo">Licença</a>
</p>

## :rocket: Sobre a aplicação

A aplicação GoBarber é uma plataforma de agendamento de serviços de estética, tendo em vista duas pontas: O prestador e o usuário. Com várias regras de negócio por conta dos horários envolvidos.

### **Funcionalidades**

Aplicação foi criada utilizando [Express](https://expressjs.com/), além utilizar as seguintes ferramentas:

- Sucrase + Nodemon;
- ESLint + Prettier + EditorConfig;
- Sequelize (PostgreSQL);
- Filas com Redis e Bee Queue
- Emails com NodeMailer
- MongoDB

### **Exemplo**
`Método de Agendamento: `
```js
async store(req, res) {
    const schema = Yup.object().shape({
      date: Yup.date().required(),
      provider_id: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation failed' });
    }

    const { provider_id, date } = req.body;

    /* Check if provider_id is a provider */
    const checkIsProvider = await User.findOne({
      where: { id: provider_id, provider: true },
    });
    const checkIsTheSame = await User.findOne({
      where: { id: req.userId, provider: true },
    });

    if (checkIsTheSame) {
      return res.status(401).json({
        error: 'You can not make a appointment with yourself',
      });
    }

    if (!checkIsProvider) {
      return res.status(401).json({
        error: 'You can only create appointments with providers',
      });
    }

    const hourStart = startOfHour(parseISO(date));
    /* Check for past dates */
    if (isBefore(hourStart, new Date())) {
      return res.status(400).json({
        error: 'Past dates are not permitted',
      });
    }
    /* Check date availability */
    const checkAvailability = await Appointment.findOne({
      where: {
        provider_id,
        canceled_at: null,
        date: hourStart,
      },
    });
    if (checkAvailability) {
      return res.status(400).json({ error: 'Date not available' });
    }
    const appointments = await Appointment.create({
      user_id: req.userId,
      provider_id,
      date: hourStart,
    });

    /**
     *  Notify appointment to provider
     */
    const user = await User.findByPk(req.userId);
    const formattedDate = format(
      hourStart,
      "'dia' dd 'de' MMMM', às' H:mm'h' ",
      { locale: pt },
    );
    await Notification.create({
      content: `Novo agendamento de ${user.name} para ${formattedDate}`,
      user: provider_id,
    });

    return res.json(appointments);
  }
```
- Podemos notar várias verificações, tanto em horários quanto em relação ao usuário que está tentando realizar o agendamento, 
utilizando [Yup](https://github.com/jquense/yup) para a verificação de alguns dados e [date-fns](https://date-fns.org/) para a verificação das datas

---
Feito com ♥ by araujooj :wave: