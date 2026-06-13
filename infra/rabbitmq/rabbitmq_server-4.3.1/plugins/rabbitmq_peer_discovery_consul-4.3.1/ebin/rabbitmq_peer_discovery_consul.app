{application, 'rabbitmq_peer_discovery_consul', [
	{description, "Consult-based RabbitMQ peer discovery backend"},
	{vsn, "4.3.1"},
	{id, "b9d5af1"},
	{modules, ['rabbit_peer_discovery_consul','rabbitmq_peer_discovery_consul','rabbitmq_peer_discovery_consul_app','rabbitmq_peer_discovery_consul_health_check_helper','rabbitmq_peer_discovery_consul_sup']},
	{registered, [rabbitmq_peer_discovery_consul_sup]},
	{applications, [kernel,stdlib,rabbit_common,rabbitmq_peer_discovery_common,rabbit]},
	{optional_applications, []},
	{mod, {'rabbitmq_peer_discovery_consul_app', []}},
	{env, []}
]}.