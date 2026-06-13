{application, 'rabbitmq_federation_common', [
	{description, "RabbitMQ Federation Common"},
	{vsn, "4.3.1"},
	{id, "b9d5af1"},
	{modules, ['Elixir.RabbitMQ.CLI.Ctl.Commands.FederationStatusCommand','Elixir.RabbitMQ.CLI.Ctl.Commands.RestartFederationLinkCommand','rabbit_federation_app_state','rabbit_federation_common_app','rabbit_federation_db','rabbit_federation_event','rabbit_federation_link_sup','rabbit_federation_link_util','rabbit_federation_parameters','rabbit_federation_pg','rabbit_federation_status','rabbit_federation_sup','rabbit_federation_upstream','rabbit_federation_util']},
	{registered, []},
	{applications, [kernel,stdlib,rabbit_common,rabbit,amqp_client]},
	{optional_applications, []},
	{mod, {'rabbit_federation_common_app', []}},
	{env, [
	    {pgroup_name_cluster_id, false},
	    {internal_exchange_check_interval, 90000}
	  ]},
		{broker_version_requirements, []}
]}.